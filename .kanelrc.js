const { join } = require("path");
const { recase } = require("@kristiandupont/recase");
const { tryParse } = require("tagged-comment-parser");
const { generateIndexFile } = require("kanel");

const toPascalCase = recase("snake", "pascal");
const outputPath = "./packages/types/src/generated-database-types";

/** @type {import('../src/Config').default} */
module.exports = {
  connection: {
    host: "localhost",
    user: "psql",
    password: "psql",
    database: "oidc-google",
    charset: "utf8",
    port: 5432,
  },

  outputPath,
  resolveViews: true,
  preDeleteOutputFolder: true,

  // Add a comment about the entity that the type represents above each type.
  getMetadata: (details, generateFor) => {
    const { comment: strippedComment } = tryParse(details.comment);
    const isAgentNoun = ["initializer", "mutator"].includes(generateFor);

    const relationComment = isAgentNoun
      ? `Represents the type for ${
          generateFor === "initializer" ? "inserting" : "updating"
        } entries for the ${details.kind} ${details.schemaName}.${details.name}`
      : `Represents the ${details.kind} ${details.schemaName}.${details.name}`;

    const suffix = isAgentNoun
      ? generateFor === "initializer"
        ? "Insert"
        : "Update"
      : "";

    return {
      name: "DB" + toPascalCase(details.name + suffix),
      comment: [relationComment, ...(strippedComment ? [strippedComment] : [])],
      path: join(outputPath, toPascalCase(details.name)),
    };
  },

  // Add a comment that says what the type of the column/attribute is in the database.
  getPropertyMetadata: (property, _details, generateFor) => {
    const { comment: strippedComment } = tryParse(property.comment);

    return {
      name: property.name,
      comment: [
        `Database type: ${property.expandedType}`,
        ...(generateFor === "initializer" && property.defaultValue
          ? [`Default value: ${property.defaultValue}`]
          : []),
        ...(strippedComment ? [strippedComment] : []),
      ],
    };
  },

  // This implementation will generate flavored instead of branded types.
  // See: https://spin.atomicobject.com/2018/01/15/typescript-flexible-nominal-typing/
  // NOTE: this creates unnecessary type branding type which would be
  // incompatible with GraphQL generated types for the id fields.
  generateIdentifierType: (c, d) => {
    // Id columns are already prefixed with the table name, so we don't need to add it here
    const name = toPascalCase(c.name);

    return {
      declarationType: "typeDeclaration",
      name,
      exportAs: "named",
      typeDefinition: ["string"],
      comment: ["UUID for table"],
    };
  },

  // Generate an index file with exports of everything
  preRenderHooks: [generateIndexFile],

  customTypeMap: {
    "pg_catalog.int8": "number",
    "pg_catalog.uuid": "string",
    // A text search vector could be stored as a set of strings. See Film.ts for an example.
    // "pg_catalog.tsvector": "Set<string>",
    // The bytea package (https://www.npmjs.com/package/postgres-bytea) could be used for byte arrays.
    // See Staff.ts for an example.
    // "pg_catalog.bytea": {
    //   name: "bytea",
    //   path: "bytea",
    //   isAbsolute: true,
    //   isDefault: true,
    // },
    // Columns with the following types would probably just be strings in TypeScript.
    // "pg_catalog.bpchar": "string",
    // "public.citext": "string",
  },
};
