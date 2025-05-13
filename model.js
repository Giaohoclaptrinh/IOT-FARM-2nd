// import mongoose, { Schema } from "mongoose";
import mqtt from "mqtt";
// import websocket from "websocket";
// const { client, server } = websocket;

function Server(
  opt = { url: "", username: "", password: "", topic: "", region: true }
) {
  this.opt = Object.assign({}, opt);

  this.innit = function () {
    
    // console.log("opt : ", this.opt);
    if (opt) {
      //   console.log("la cai gi :", server);
      const Client = mqtt.connect(this.opt.url, {
        username: this.opt.username,
         password: this.opt.password,
         protocol: "wss",
    });


      Client.on("connect", () => {
        console.log("Connected to MQTT broker");

        // Subscribe vào topic bạn muốn nhận dữ liệu
        Client.subscribe(this.opt.topic, (err) => {
          if (err) {
            console.error("Subscription error: ", err);
            return res.status(500).send("Failed to subscribe to topic");
          }

          //   if (this.opt.region) {
          //     const websocketClient = new server({
          //       httpServer: `http://api.weatherapi.com/v1/current.json?key=da726e35a1b44d0aa2a15854250605&q=16.4600344720853,107.592912826118&aqi=no`,
          //       autoAcceptConnections: false,
          //     });
          //   }
          console.log(`Subscribed to topic: ${this.opt.topic}`);
        });
      });

      Client.on("message", async (topic, message) => {
        const data = JSON.parse(message.toString());
        const getdata = {
          id_device: data.end_device_ids.device_id,
          ...data.uplink_message.decoded_payload,
          recieved_at: data.received_at,
        };
        // console.log(getdata);
        // console.log(data.received_at);

        console.log(getdata);
        // await this.SchemaDynamic(getdata);
      });
      return Client;
    }
    return;
  };

  this.editTopic = function (deviceId) {
    if (this.opt.topic.includes("+") && deviceId) {
      this.opt.topic = this.opt.topic.replace("+", deviceId.trim());
    }
  };
}
// Server.prototype.SchemaDynamic = async function (data) {
//   const schema = {};
//   for (let key in data) {
//     const type_item = typeof data[key];
//     switch (type_item) {
//       case "string":
//         const date = new Date(data[key]);
//         if (!isNaN(date)) {
//           schema[key] = { type: Date };
//         } else {
//           schema[key] = { type: String };
//         }
//         break;
//       case "number":
//         schema[key] = { type: Number };
//         break;
//       case "boolean":
//         schema[key] = { type: Boolean };
//         break;
//       case "object":
//         schema[key] = Array.isArray(data[key])
//           ? [{ type: Schema.Types.Mixed }]
//           : { type: Schema.Types.Mixed };
//         break;
//       default:
//         break;
//     }
//   }
//   console.log(`id :  (${data.id_device})`, schema);
//   const dynamic_schema = new Schema(schema);
//   const db = await mongoose.connection.collection("items");
//   if (db) {
//     db.insertOne(data);
//     console.log("con cai nit");
//   }

//   //   await db.create(data);
//   console.log("da them vao db :  ");
// };

// Server.prototype.GetDocUnique = async function () {
//   const items = mongoose.connection.collection("items");
//   const result = await items.aggregate([
//     {
//       $group: {
//         _id: "$id_device",
//         doc: { $first: "$$ROOT" },
//       },
//     },
//     //   {
//     //     $replaceRoot: { newRoot: "$doc" },
//     //   },
//   ]);
//   return result.toArray();
// };
// Server.prototype.ChangeAttribute = async function (
//   id_device = "stm32-motor-current-3"
// ) {
//   const items = mongoose.connection.collection("items");
//   const device = await items.findOne({ id_device });
//   console.log(device);
//   items.updateMany(
//     { id_device: id_device },
//     { $rename: { m5_pH: "ph_nam", m5_pH_temp: "temp_nam" } }
//   );
// };

export default Server;
