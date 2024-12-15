import { producer, express } from "./producerInstance.js";

const app = express();
const PORT = 3000;

app.use(express.json());

(async () => {
	try {
		await producer.connect();
		console.log("Connect to kafka");
	} catch (error) {
		console.error("Error connect kafka", error);
	}
})();

app.post("/auth/register", async (req, res) => {
	const { topic, username, gender, email } = req.body;
	const values = {
		username,
		gender,
		email
	};
	try {
		await producer.send({
			topic: topic,
			messages: [
				{
					key: null,
					value: JSON.stringify(values)
				}
			]
		});
		res.status(200).send({ message: "Message sent to Kafka successfully" });
	} catch (error) {
		console.error("Fail send data to topic", error);
		res.status(500).send({ error: "Fail send data to topic" });
	}
});

app.listen(PORT, () => {
	console.log("Server start on http://localhost:", PORT);
});

// Graceful shutdown
process.on("SIGINT", async () => {
	console.log("Closing Kafka producer...");
	await producer.disconnect();
	console.log("Kafka producer closed");
	process.exit(0);
});
