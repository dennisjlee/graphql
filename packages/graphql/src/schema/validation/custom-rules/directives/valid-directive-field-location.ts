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

import type {
    ASTVisitor,
    DirectiveNode,
    FieldDefinitionNode,
    InterfaceTypeDefinitionNode,
    ObjectTypeDefinitionNode,
} from "graphql";
import { Kind } from "graphql";
import type { SDLValidationContext } from "graphql/validation/ValidationContext";
import { createGraphQLError, assertValid, DocumentValidationError } from "../utils/document-validation-error";
import { getPathToNode } from "../utils/path-parser";
import * as directives from "../../../../graphql/directives";
import { typeDependantDirectivesScaffolds } from "../../../../graphql/directives/type-dependant-directives/scaffolds";

// TODO object extension and interface extension are possible in parent of type def from getPathNode

/** only the @cypher directive is valid on fields of Root types: Query, Mutation; no directives valid on fields of Subscription */
export function ValidDirectiveAtFieldLocation(context: SDLValidationContext): ASTVisitor {
    return {
        Directive(directiveNode: DirectiveNode, _key, _parent, path, ancestors) {
            const [pathToNode, traversedDef, parentOfTraversedDef] = getPathToNode(path, ancestors);
            if (!traversedDef || traversedDef.kind !== Kind.FIELD_DEFINITION) {
                // only want to check directives on fields
                return;
            }
            if (!parentOfTraversedDef) {
                // this rule only checks field location, parent needs to exist
                console.error("No parent of definition found");
                return;
            }
            const shouldRunThisRule = isDirectiveValidAtLocation({
                directiveNode,
                traversedDef,
                parentDef: parentOfTraversedDef,
            });

            if (!shouldRunThisRule) {
                return;
            }

            const { isValid, errorMsg, errorPath } = assertValid(shouldRunThisRule);
            if (!isValid) {
                context.reportError(
                    createGraphQLError({
                        nodes: [traversedDef],
                        path: [...pathToNode, ...errorPath],
                        errorMsg,
                    })
                );
            }
        },
    };
}

function isDirectiveValidAtLocation({
    directiveNode,
    traversedDef,
    parentDef,
}: {
    directiveNode: DirectiveNode;
    traversedDef: FieldDefinitionNode;
    parentDef: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode;
}) {
    if (isLocationFieldOfRootType(parentDef)) {
        return () =>
            validFieldOfRootTypeLocation({
                directiveNode,
                traversedDef: traversedDef,
                parentDef,
            });
    }
    if (isLocationFieldOfInterfaceType(parentDef)) {
        return () => validFieldOfInterfaceTypeLocation({ directiveNode, parentDef });
    }
    return;
}

function isLocationFieldOfRootType(
    parentDef: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode
): parentDef is ObjectTypeDefinitionNode {
    return (
        parentDef &&
        parentDef.kind === Kind.OBJECT_TYPE_DEFINITION &&
        ["Query", "Mutation", "Subscription"].includes(parentDef.name.value)
    );
}

function isLocationFieldOfInterfaceType(
    parentDef: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode
): parentDef is InterfaceTypeDefinitionNode {
    return parentDef && parentDef.kind === Kind.INTERFACE_TYPE_DEFINITION;
}

function noDirectivesAllowedAtLocation({
    directiveNode,
    parentDef,
}: {
    directiveNode: DirectiveNode;
    parentDef: ObjectTypeDefinitionNode | InterfaceTypeDefinitionNode;
}) {
    const allDirectivesDefinedByNeo4jGraphQL = Object.values(directives).concat(typeDependantDirectivesScaffolds);
    const directiveAtInvalidLocation = allDirectivesDefinedByNeo4jGraphQL.find(
        (d) => d.name === directiveNode.name.value
    );
    if (directiveAtInvalidLocation) {
        throw new DocumentValidationError(
            `Invalid directive usage: Directive @${directiveAtInvalidLocation.name} is not supported on fields of the ${parentDef.name.value} type.`,
            [`@${directiveNode.name.value}`]
        );
    }
}

function validFieldOfInterfaceTypeLocation({
    directiveNode,
    parentDef,
}: {
    directiveNode: DirectiveNode;
    parentDef: InterfaceTypeDefinitionNode;
}) {
    if (parentDef.directives?.find((d) => d.name.value === "relationshipProperties")) {
        // relationshipProperties interfaces are allowed to have directives
        // delegate to valid-relationship-properties rule
        return;
    }
    noDirectivesAllowedAtLocation({ directiveNode, parentDef });
}

function validFieldOfRootTypeLocation({
    directiveNode,
    traversedDef,
    parentDef,
}: {
    directiveNode: DirectiveNode;
    traversedDef: FieldDefinitionNode;
    parentDef: ObjectTypeDefinitionNode;
}) {
    if (parentDef.name.value !== "Subscription") {
        // some directives are valid on Query | Mutation
        if (directiveNode.name.value === "cypher") {
            // @cypher is valid
            return;
        }
        const isDirectiveCombinedWithCypher = traversedDef.directives?.some(
            (directive) => directive.name.value === "cypher"
        );
        if (directiveNode.name.value === "authentication" && isDirectiveCombinedWithCypher) {
            // @cypher @authentication combo is valid
            return;
        }
        // explicitly checked for "enhanced" error messages
        if (directiveNode.name.value === "authentication" && !isDirectiveCombinedWithCypher) {
            throw new DocumentValidationError(
                `Invalid directive usage: Directive @authentication is not supported on fields of the ${parentDef.name.value} type unless it is a @cypher field.`,
                [`@${directiveNode.name.value}`]
            );
        }
        if (directiveNode.name.value === "authorization" && isDirectiveCombinedWithCypher) {
            throw new DocumentValidationError(
                `Invalid directive usage: Directive @authorization is not supported on fields of the ${parentDef.name.value} type. Did you mean to use @authentication?`,
                [`@${directiveNode.name.value}`]
            );
        }
    }
    noDirectivesAllowedAtLocation({ directiveNode, parentDef });
}
