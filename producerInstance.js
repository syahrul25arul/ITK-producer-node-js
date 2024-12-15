import { Kafka } from "kafkajs";
import express from "express";

const kafka = new Kafka({
	brokers: ["localhost:9092"],
	clientId: "auth-producer"
});

const producer = kafka.producer();
export { producer, express };
