/*
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Neo4jGraphQLAuthJWTPlugin } from "@neo4j/graphql-plugin-auth";
import { gql } from "apollo-server";
import { DocumentNode } from "graphql";
import { Neo4jGraphQL } from "../../../../../../src";
import { createJwtRequest } from "../../../../../utils/create-jwt-request";
import { formatCypher, translateQuery, formatParams } from "../../../../utils/tck-test-utils";

describe("Cypher -> Connections -> Filtering -> Relationship -> Temporal", () => {
    const secret = "secret";
    let typeDefs: DocumentNode;
    let neoSchema: Neo4jGraphQL;

    beforeAll(() => {
        typeDefs = gql`
            type Movie {
                title: String!
                actors: [Actor!]! @relationship(type: "ACTED_IN", properties: "ActedIn", direction: IN)
            }

            type Actor {
                name: String!
                movies: [Movie!]! @relationship(type: "ACTED_IN", properties: "ActedIn", direction: OUT)
            }

            interface ActedIn {
                startDate: Date
                endDateTime: DateTime
            }
        `;

        neoSchema = new Neo4jGraphQL({
            typeDefs,
            config: { enableRegex: true },
            plugins: {
                auth: new Neo4jGraphQLAuthJWTPlugin({
                    secret,
                }),
            },
        });
    });

    test("DISTANCE", async () => {
        const query = gql`
            query {
                movies {
                    title
                    actorsConnection(
                        where: { edge: { startDate_GT: "2000-01-01", endDateTime_LT: "2010-01-01T00:00:00.000Z" } }
                    ) {
                        edges {
                            startDate
                            endDateTime
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Movie)
            CALL {
            WITH this
            MATCH (this)<-[this_acted_in_relationship:ACTED_IN]-(this_actor:Actor)
            WHERE this_acted_in_relationship.startDate > $this_actorsConnection.args.where.edge.startDate_GT AND this_acted_in_relationship.endDateTime < $this_actorsConnection.args.where.edge.endDateTime_LT
            WITH collect({ startDate: this_acted_in_relationship.startDate, endDateTime: apoc.date.convertFormat(toString(this_acted_in_relationship.endDateTime), \\"iso_zoned_date_time\\", \\"iso_offset_date_time\\"), node: { name: this_actor.name } }) AS edges
            RETURN { edges: edges, totalCount: size(edges) } AS actorsConnection
            }
            RETURN this { .title, actorsConnection } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_actorsConnection\\": {
                    \\"args\\": {
                        \\"where\\": {
                            \\"edge\\": {
                                \\"startDate_GT\\": {
                                    \\"year\\": 2000,
                                    \\"month\\": 1,
                                    \\"day\\": 1
                                },
                                \\"endDateTime_LT\\": {
                                    \\"year\\": 2010,
                                    \\"month\\": 1,
                                    \\"day\\": 1,
                                    \\"hour\\": 0,
                                    \\"minute\\": 0,
                                    \\"second\\": 0,
                                    \\"nanosecond\\": 0,
                                    \\"timeZoneOffsetSeconds\\": 0
                                }
                            }
                        }
                    }
                }
            }"
        `);
    });
});
