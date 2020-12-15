// Remove `.example` from the file extension to configure Dominus.

import type { ConnectionOptions } from "typeorm";
import type { ClientOptions } from "discord.js";

export const NAME = "Dominus";
export const PREFIX = "d!";

export const OWNERS = [];

// #region secrets
export const CLIENT_ID = "";
export const CLIENT_SECRET = "";
// #endregion

export const PGSQL_DATABASE_NAME = "";
export const PGSQL_DATABASE_PASSWORD = "";
export const PGSQL_DATABASE_USER = "";
export const PGSQL_DATABASE_PORT = 5432;
export const PGSQL_DATABASE_HOST = "localhost";
export const PGSQL_DATABASE_URL = `posgresql://${PGSQL_DATABASE_USER}:${PGSQL_DATABASE_PASSWORD}@${PGSQL_DATABASE_HOST}:${PGSQL_DATABASE_PORT}/${PGSQL_DATABASE_NAME}`;

export const PGSQL_DATABASE_OPTIONS: ConnectionOptions = {
	type: "postgres"
};

export const CLIENT_OPTIONS: ClientOptions = {};

export const TOKENS = {
	// #region secrets
	BOT_TOKEN: ""
	// #endregion
};
