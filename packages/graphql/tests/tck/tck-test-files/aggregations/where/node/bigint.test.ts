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

import { gql } from "apollo-server";
import { DocumentNode } from "graphql";
import { Neo4jGraphQL } from "../../../../../../src";
import { createJwtRequest } from "../../../../../utils/create-jwt-request";
import { formatCypher, translateQuery, formatParams } from "../../../../utils/tck-test-utils";

describe("Cypher Aggregations where node with BigInt", () => {
    let typeDefs: DocumentNode;
    let neoSchema: Neo4jGraphQL;

    beforeAll(() => {
        typeDefs = gql`
            type User {
                someBigInt: BigInt
                someBigIntAlias: BigInt @alias(property: "_someBigIntAlias")
            }

            type Post {
                content: String!
                likes: [User!]! @relationship(type: "LIKES", direction: IN)
            }
        `;

        neoSchema = new Neo4jGraphQL({
            typeDefs,
            config: { enableRegex: true },
        });
    });

    test("EQUAL", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_EQUAL: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN this_likesAggregate_node.someBigInt = $this_likesAggregate_node_someBigInt_EQUAL
            \\", { this: this, this_likesAggregate_node_someBigInt_EQUAL: $this_likesAggregate_node_someBigInt_EQUAL }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_EQUAL\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("EQUAL with alias", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigIntAlias_EQUAL: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN this_likesAggregate_node._someBigIntAlias = $this_likesAggregate_node_someBigIntAlias_EQUAL
            \\", { this: this, this_likesAggregate_node_someBigIntAlias_EQUAL: $this_likesAggregate_node_someBigIntAlias_EQUAL }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigIntAlias_EQUAL\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("GT", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_GT: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN this_likesAggregate_node.someBigInt > $this_likesAggregate_node_someBigInt_GT
            \\", { this: this, this_likesAggregate_node_someBigInt_GT: $this_likesAggregate_node_someBigInt_GT }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_GT\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("GTE", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_GTE: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN this_likesAggregate_node.someBigInt >= $this_likesAggregate_node_someBigInt_GTE
            \\", { this: this, this_likesAggregate_node_someBigInt_GTE: $this_likesAggregate_node_someBigInt_GTE }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_GTE\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("LT", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_LT: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN this_likesAggregate_node.someBigInt < $this_likesAggregate_node_someBigInt_LT
            \\", { this: this, this_likesAggregate_node_someBigInt_LT: $this_likesAggregate_node_someBigInt_LT }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_LT\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("LTE", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_LTE: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN this_likesAggregate_node.someBigInt <= $this_likesAggregate_node_someBigInt_LTE
            \\", { this: this, this_likesAggregate_node_someBigInt_LTE: $this_likesAggregate_node_someBigInt_LTE }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_LTE\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("AVERAGE_EQUAL", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_AVERAGE_EQUAL: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN avg(this_likesAggregate_node.someBigInt) = $this_likesAggregate_node_someBigInt_AVERAGE_EQUAL
            \\", { this: this, this_likesAggregate_node_someBigInt_AVERAGE_EQUAL: $this_likesAggregate_node_someBigInt_AVERAGE_EQUAL }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_AVERAGE_EQUAL\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("AVERAGE_GT", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_AVERAGE_GT: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN avg(this_likesAggregate_node.someBigInt) > $this_likesAggregate_node_someBigInt_AVERAGE_GT
            \\", { this: this, this_likesAggregate_node_someBigInt_AVERAGE_GT: $this_likesAggregate_node_someBigInt_AVERAGE_GT }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_AVERAGE_GT\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("AVERAGE_GTE", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_AVERAGE_GTE: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN avg(this_likesAggregate_node.someBigInt) >= $this_likesAggregate_node_someBigInt_AVERAGE_GTE
            \\", { this: this, this_likesAggregate_node_someBigInt_AVERAGE_GTE: $this_likesAggregate_node_someBigInt_AVERAGE_GTE }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_AVERAGE_GTE\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("AVERAGE_LT", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_AVERAGE_LT: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN avg(this_likesAggregate_node.someBigInt) < $this_likesAggregate_node_someBigInt_AVERAGE_LT
            \\", { this: this, this_likesAggregate_node_someBigInt_AVERAGE_LT: $this_likesAggregate_node_someBigInt_AVERAGE_LT }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_AVERAGE_LT\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("AVERAGE_LTE", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_AVERAGE_LTE: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN avg(this_likesAggregate_node.someBigInt) <= $this_likesAggregate_node_someBigInt_AVERAGE_LTE
            \\", { this: this, this_likesAggregate_node_someBigInt_AVERAGE_LTE: $this_likesAggregate_node_someBigInt_AVERAGE_LTE }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_AVERAGE_LTE\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("SUM_EQUAL", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_SUM_EQUAL: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            WITH this_likesAggregate_node, this_likesAggregate_edge, sum(this_likesAggregate_node.someBigInt) AS this_likesAggregate_node_someBigInt_SUM_EQUAL_SUM
            RETURN this_likesAggregate_node_someBigInt_SUM_EQUAL_SUM = toFloat($this_likesAggregate_node_someBigInt_SUM_EQUAL)
            \\", { this: this, this_likesAggregate_node_someBigInt_SUM_EQUAL: $this_likesAggregate_node_someBigInt_SUM_EQUAL }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_SUM_EQUAL\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("SUM_GT", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_SUM_GT: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            WITH this_likesAggregate_node, this_likesAggregate_edge, sum(this_likesAggregate_node.someBigInt) AS this_likesAggregate_node_someBigInt_SUM_GT_SUM
            RETURN this_likesAggregate_node_someBigInt_SUM_GT_SUM > toFloat($this_likesAggregate_node_someBigInt_SUM_GT)
            \\", { this: this, this_likesAggregate_node_someBigInt_SUM_GT: $this_likesAggregate_node_someBigInt_SUM_GT }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_SUM_GT\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("SUM_GTE", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_SUM_GTE: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            WITH this_likesAggregate_node, this_likesAggregate_edge, sum(this_likesAggregate_node.someBigInt) AS this_likesAggregate_node_someBigInt_SUM_GTE_SUM
            RETURN this_likesAggregate_node_someBigInt_SUM_GTE_SUM >= toFloat($this_likesAggregate_node_someBigInt_SUM_GTE)
            \\", { this: this, this_likesAggregate_node_someBigInt_SUM_GTE: $this_likesAggregate_node_someBigInt_SUM_GTE }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_SUM_GTE\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("SUM_LT", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_SUM_LT: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            WITH this_likesAggregate_node, this_likesAggregate_edge, sum(this_likesAggregate_node.someBigInt) AS this_likesAggregate_node_someBigInt_SUM_LT_SUM
            RETURN this_likesAggregate_node_someBigInt_SUM_LT_SUM < toFloat($this_likesAggregate_node_someBigInt_SUM_LT)
            \\", { this: this, this_likesAggregate_node_someBigInt_SUM_LT: $this_likesAggregate_node_someBigInt_SUM_LT }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_SUM_LT\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("SUM_LTE", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_SUM_LTE: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            WITH this_likesAggregate_node, this_likesAggregate_edge, sum(this_likesAggregate_node.someBigInt) AS this_likesAggregate_node_someBigInt_SUM_LTE_SUM
            RETURN this_likesAggregate_node_someBigInt_SUM_LTE_SUM <= toFloat($this_likesAggregate_node_someBigInt_SUM_LTE)
            \\", { this: this, this_likesAggregate_node_someBigInt_SUM_LTE: $this_likesAggregate_node_someBigInt_SUM_LTE }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_SUM_LTE\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("MIN_EQUAL", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_MIN_EQUAL: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN  min(this_likesAggregate_node.someBigInt) = $this_likesAggregate_node_someBigInt_MIN_EQUAL
            \\", { this: this, this_likesAggregate_node_someBigInt_MIN_EQUAL: $this_likesAggregate_node_someBigInt_MIN_EQUAL }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_MIN_EQUAL\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("MIN_GT", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_MIN_GT: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN  min(this_likesAggregate_node.someBigInt) > $this_likesAggregate_node_someBigInt_MIN_GT
            \\", { this: this, this_likesAggregate_node_someBigInt_MIN_GT: $this_likesAggregate_node_someBigInt_MIN_GT }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_MIN_GT\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("MIN_GTE", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_MIN_GTE: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN  min(this_likesAggregate_node.someBigInt) >= $this_likesAggregate_node_someBigInt_MIN_GTE
            \\", { this: this, this_likesAggregate_node_someBigInt_MIN_GTE: $this_likesAggregate_node_someBigInt_MIN_GTE }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_MIN_GTE\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("MIN_LT", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_MIN_LT: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN  min(this_likesAggregate_node.someBigInt) < $this_likesAggregate_node_someBigInt_MIN_LT
            \\", { this: this, this_likesAggregate_node_someBigInt_MIN_LT: $this_likesAggregate_node_someBigInt_MIN_LT }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_MIN_LT\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("MIN_LTE", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_MIN_LTE: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN  min(this_likesAggregate_node.someBigInt) <= $this_likesAggregate_node_someBigInt_MIN_LTE
            \\", { this: this, this_likesAggregate_node_someBigInt_MIN_LTE: $this_likesAggregate_node_someBigInt_MIN_LTE }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_MIN_LTE\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("MAX_EQUAL", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_MAX_EQUAL: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN  max(this_likesAggregate_node.someBigInt) = $this_likesAggregate_node_someBigInt_MAX_EQUAL
            \\", { this: this, this_likesAggregate_node_someBigInt_MAX_EQUAL: $this_likesAggregate_node_someBigInt_MAX_EQUAL }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_MAX_EQUAL\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("MAX_GT", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_MAX_GT: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN  max(this_likesAggregate_node.someBigInt) > $this_likesAggregate_node_someBigInt_MAX_GT
            \\", { this: this, this_likesAggregate_node_someBigInt_MAX_GT: $this_likesAggregate_node_someBigInt_MAX_GT }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_MAX_GT\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("MAX_GTE", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_MAX_GTE: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN  max(this_likesAggregate_node.someBigInt) >= $this_likesAggregate_node_someBigInt_MAX_GTE
            \\", { this: this, this_likesAggregate_node_someBigInt_MAX_GTE: $this_likesAggregate_node_someBigInt_MAX_GTE }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_MAX_GTE\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("MAX_LT", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_MAX_LT: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN  max(this_likesAggregate_node.someBigInt) < $this_likesAggregate_node_someBigInt_MAX_LT
            \\", { this: this, this_likesAggregate_node_someBigInt_MAX_LT: $this_likesAggregate_node_someBigInt_MAX_LT }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_MAX_LT\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });

    test("MAX_LTE", async () => {
        const query = gql`
            {
                posts(where: { likesAggregate: { node: { someBigInt_MAX_LTE: "2147483648" } } }) {
                    content
                }
            }
        `;

        const req = createJwtRequest("secret", {});
        const result = await translateQuery(neoSchema, query, {
            req,
        });

        expect(formatCypher(result.cypher)).toMatchInlineSnapshot(`
            "MATCH (this:Post)
            WHERE apoc.cypher.runFirstColumn(\\" MATCH (this)<-[this_likesAggregate_edge:LIKES]-(this_likesAggregate_node:User)
            RETURN  max(this_likesAggregate_node.someBigInt) <= $this_likesAggregate_node_someBigInt_MAX_LTE
            \\", { this: this, this_likesAggregate_node_someBigInt_MAX_LTE: $this_likesAggregate_node_someBigInt_MAX_LTE }, false )
            RETURN this { .content } as this"
        `);

        expect(formatParams(result.params)).toMatchInlineSnapshot(`
            "{
                \\"this_likesAggregate_node_someBigInt_MAX_LTE\\": {
                    \\"low\\": -2147483648,
                    \\"high\\": 0
                }
            }"
        `);
    });
});
