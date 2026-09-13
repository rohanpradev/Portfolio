---
title: Reagent Optimization with Agentic AI
description: A Strands agent at Optum, deployed with AgentCore Runtime and Memory, that runs reagent optimization through AWS Batch and stores results in Amazon S3.
seoTitle: Optum Reagent Optimization Agent | M Rohan Pradev
seoDescription: Strands Agents, Amazon Bedrock AgentCore Runtime and Memory, AWS Batch, and S3 connected in a reagent optimization workflow at Optum.
order: 0
featured: true
company: Optum
role: Lead Full Stack Engineer
duration: At Optum · Current role
engagement: Strands agent implementation, AgentCore Runtime and Memory integration, AWS Batch optimization, and S3 result storage
publishedDate: 2026-09-11
updatedDate: 2026-09-11
tech:
  - Strands Agents
  - AgentCore Runtime
  - AgentCore Memory
  - AWS Batch
  - Amazon S3
services:
  - Agent implementation
  - Agent runtime and memory
  - Optimization job orchestration
  - Result storage
outcomes:
  - value: Strands + AgentCore
    label: Agent and memory
  - value: AWS Batch
    label: Reagent optimization
  - value: Amazon S3
    label: Stored results
cover: ../../assets/projects/reagent-architecture.png
coverAlt: Architecture overview showing a Strands agent in AgentCore Runtime connected to AgentCore Memory, AWS Batch optimization, and S3 results
gallery:
  - src: ../../assets/projects/reagent-architecture.png
    alt: Strands agent with AgentCore Runtime and Memory, AWS Batch, and Amazon S3
    caption: Architecture overview of the reagent optimization workflow implemented at Optum.
---
## The project

At Optum, I worked on a reagent optimization project where an AI agent could perform optimization using AWS Batch and store the results in Amazon S3.

I implemented the agent with **Strands Agents**, **Amazon Bedrock AgentCore Runtime**, and **AgentCore Memory**, connecting the agent workflow to the compute and storage services behind it.

## What I implemented

- A Strands agent for the reagent optimization workflow.
- AgentCore Runtime to run the agent.
- AgentCore Memory integration for agent context.
- AWS Batch integration to perform reagent optimization.
- Amazon S3 storage for the optimization results.

## How the pieces connect

The Strands agent is the orchestration layer. It runs within AgentCore Runtime and integrates with AgentCore Memory. The optimization computation takes place through AWS Batch, with results stored in Amazon S3.

These services play distinct roles: Strands handles the agent workflow, AgentCore provides runtime and memory, Batch executes the optimization work, and S3 holds its output.

## Engineering focus

This work connected agent behavior to an executable cloud workflow. My contribution covered the agent implementation and its integration with runtime, memory, compute, and result storage.

It is an example of the engineering I enjoy: taking an AI capability beyond conversation and connecting it to useful work in a larger system.

