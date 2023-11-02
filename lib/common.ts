import config from "../config/config.json";
import { writeFileSync } from "fs";

export default function updateConfig() {
    writeFileSync('./config/config.json', JSON.stringify(config))
}