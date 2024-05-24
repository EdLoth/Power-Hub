import "reflect-metadata";

import path from "path";

import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";

import dotenv from "dotenv";
