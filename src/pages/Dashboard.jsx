// import React, { useState, useEffect } from "react";
// import { db, auth } from "@/firebase/db.config";
// import { collection, query, where, onSnapshot } from "firebase/firestore";
// import TemperatureChart from "@/components/Chart/TemperatureChart";
// import TemperatureInput from "@/components/Chart/TemperatureInput";

// const Dashboard = () => {
//   const [devices, setDevices] = useState([]);
//   const [deviceId, setDeviceId] = useState("");

//   useEffect(() => {
//     const user = auth.currentUser;
//     if (!user) return;

//     const q = query(collection(db, "devices"), where("userUID", "==", user.uid));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const deviceList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setDevices(deviceList);
//       if (deviceList.length > 0) setDeviceId(deviceList[0].id);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">🌡️ Quản lý Nhiệt độ Thiết bị</h1>

//       <div className="mb-4">
//         <label className="block font-medium">Chọn thiết bị:</label>
//         <select
//           value={deviceId}
//           onChange={(e) => setDeviceId(e.target.value)}
//           className="mt-1 p-2 border rounded w-full"
//         >
//           {devices.length > 0 ? (
//             devices.map((device) => (
//               <option key={device.id} value={device.id}>
//                 {device.name || `Thiết bị ${device.id}`}
//               </option>
//             ))
//           ) : (
//             <option disabled>Không có thiết bị nào</option>
//           )}
//         </select>
//       </div>

//       {deviceId && <TemperatureChart deviceId={deviceId} />}
//       {deviceId && <TemperatureInput deviceId={deviceId} />}
//     </div>
//   );
// };

// export default Dashboard;
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/db.config";
import { collection, doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import TemperatureChart from "@/components/Chart/TemperatureAndHumidityChart";
import TemperatureInput from "@/components/Chart/TemperatureInput";
import HomeWrap from "./HomeWrap";

const Dashboard = () => {
  const { deviceUid } = useParams();
  const [deviceData, setDeviceData] = useState(null);

  useEffect(() => {
    const fetchDeviceData = async () => {
      const docRef = doc(db, "devices", deviceUid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDeviceData(docSnap.data());
        console.log("data",docSnap.data())
      } else {
        setDeviceData(deviceUid);
      }
    };
    fetchDeviceData();
  }, [deviceUid]);


  // console.log(window.location.pathname)
  //   const q = query(collection(db, "devices"), where("userUID", "==", auth.currentUser.uid));
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     const deviceList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //     // setDevices(deviceList);
  //     if (deviceList.length > 0) setDeviceId(deviceList[0].id);
  //   });
   
  
  if (!deviceData) {
    return (<div>
     
    </div>)
  }

  return (
    <HomeWrap>
      <div className=" w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4">🌡️ Quản lý Nhiệt độ Thiết bị</h1>
        <h2 className="text-xl font-bold">Dashboard - {deviceUid}</h2>
        {/* <p>Nhiệt độ: {deviceData.temperature}°C</p>
        <p>Độ ẩm: {deviceData.humidity}%</p> */}
        <TemperatureChart deviceId={deviceUid} />
        <TemperatureInput deviceId={deviceUid} />
        <div className="min-w-full">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fuga laborum veniam voluptas quis assumenda, nesciunt unde quisquam aut sequi ipsam cumque tempore ipsa cum accusamus, possimus dicta dolorum a itaque totam? Corrupti reprehenderit delectus quaerat earum ducimus quia inventore libero saepe ab ut voluptates, quae, tempora recusandae molestiae reiciendis adipisci doloribus nemo eaque commodi quis! Quos quis culpa debitis temporibus laudantium neque eligendi possimus error voluptates, eos iste quisquam provident adipisci expedita nulla aspernatur. Optio possimus sint at alias, voluptatem id, a explicabo doloribus iusto nobis aliquam porro tempore quasi, adipisci minus ab vel quisquam culpa provident. Veritatis, repellat impedit distinctio odio temporibus cumque perferendis saepe labore illo incidunt neque. Facere dolorum eaque nostrum possimus autem vel placeat dolore aut porro, at voluptatum, optio voluptates aperiam magnam recusandae delectus dolorem doloremque sit non dolores debitis suscipit distinctio error? Ea at perspiciatis in repellat quia, ducimus similique sequi molestiae, eveniet libero quas maxime, et recusandae nobis culpa quis labore rerum perferendis quibusdam illo officiis consequuntur expedita? Assumenda harum beatae perspiciatis enim? Adipisci, neque. Repellendus dolorum et esse repellat unde odit ratione ducimus vitae enim repudiandae! Velit tempora laudantium repellat obcaecati praesentium distinctio voluptas harum ea eveniet doloribus, dolore unde aspernatur voluptatem tenetur quo possimus ex aut enim aperiam. Id, quo eos. Perferendis, dolorem hic at blanditiis commodi aut inventore animi. Amet magnam recusandae inventore nam, praesentium expedita earum odio laborum beatae exercitationem! Ipsa eligendi quo nobis, similique quia sequi natus incidunt. Laboriosam cupiditate recusandae molestiae doloremque dicta quaerat assumenda harum, voluptatum, sunt explicabo rerum, animi aspernatur! Deleniti maiores blanditiis incidunt, eveniet ea labore adipisci sapiente fugiat, impedit veniam accusantium porro perferendis. Beatae corrupti consectetur numquam aut tempora accusantium sequi earum culpa qui alias repudiandae hic expedita labore vitae nostrum natus voluptate, vel iste eos saepe. Ut cum voluptas necessitatibus dolorum eaque debitis error. Perspiciatis, aliquam rem error amet laboriosam non ad placeat quas sapiente consectetur necessitatibus fugiat neque hic at nostrum, ex ut itaque odio, aspernatur debitis commodi beatae assumenda totam? Accusamus labore voluptas ipsum officia. Incidunt ratione repellendus neque labore molestiae. Rem expedita ab, modi temporibus repellendus eius ducimus molestias at! Iure atque maiores pariatur numquam repudiandae qui aspernatur rem, assumenda, officia est nesciunt quaerat accusamus nulla commodi ab sed placeat odit eos vero in aliquid corrupti quas asperiores quod? Vel labore commodi deserunt consectetur expedita qui repellendus, iure perspiciatis nulla ut, odit illum in quis nihil voluptatum? Unde, voluptatibus amet! Qui harum placeat ut et, provident, voluptatibus laboriosam fuga aspernatur nesciunt ipsum libero perferendis fugiat nostrum deleniti eius quidem dolorum corporis incidunt veritatis eligendi quod voluptate ipsam. Eligendi voluptates libero ad ipsa reiciendis quasi rem neque. Voluptas praesentium eum quidem provident eos dolorem dolores, expedita qui ut veniam. Repellendus iste id quaerat omnis excepturi harum quo pariatur? Iure velit harum officia sit nulla itaque labore ipsam, voluptate nesciunt! Eligendi molestias quaerat rerum quod mollitia veritatis beatae, libero adipisci tenetur laudantium exercitationem accusamus qui cum vero ratione nostrum, dignissimos necessitatibus, totam veniam delectus iure ab fuga magnam. Ipsum sapiente ea neque modi? Dolore eius eaque magnam nemo molestias quisquam maxime, aut ducimus alias ex ea aliquam omnis id dolores sint error inventore veritatis exercitationem explicabo, a ipsum. Mollitia sit quisquam beatae odit corporis vel possimus esse aut! Quam omnis ab rem quae praesentium odit fuga necessitatibus! Aperiam facilis cumque possimus! Quo animi nesciunt dignissimos! Modi, totam officia maiores sint sunt in ratione aliquid repellendus possimus necessitatibus, libero nemo reiciendis tempora perferendis recusandae consectetur aspernatur facilis maxime hic esse! Molestias reprehenderit vero, neque ipsam beatae totam at quaerat natus? Accusamus maxime ducimus ullam, laudantium nemo saepe, fuga nulla, assumenda provident iure tempore soluta sint numquam quo vel? Pariatur sint minima molestias voluptatem culpa vel sed. Nemo architecto enim harum, fuga minima natus repellendus magnam, inventore soluta pariatur optio? Odio itaque nobis repudiandae quia non id cum unde. Eos, mollitia fugit aliquid optio inventore placeat libero quae minima voluptatum! Perferendis voluptas eveniet inventore voluptate architecto illum, accusamus reiciendis corporis delectus reprehenderit nam. Accusantium dolore aut magni, illum labore aliquid adipisci odio sint esse repellendus porro voluptatum distinctio enim corrupti iusto dolorem sunt tempora debitis voluptatibus ullam asperiores rerum. Minima ad error laboriosam dignissimos quod. Quisquam nulla tempora, recusandae veniam distinctio hic ipsa sunt illo voluptatem nihil rem sapiente expedita accusamus culpa doloribus corrupti commodi, porro minus error dicta saepe, suscipit ipsam nostrum temporibus. Illo numquam illum praesentium quidem itaque. Sapiente iure corrupti beatae doloremque inventore cum voluptate quam debitis dignissimos blanditiis placeat iste, eveniet veritatis eaque officia illo quisquam nobis eos cupiditate pariatur. Eligendi corporis eius nesciunt reiciendis. Animi, quasi! Quam, voluptatum omnis illo libero itaque esse. Autem tempore sint aliquid, asperiores accusamus quisquam dignissimos aliquam cum inventore illo sed deleniti consectetur enim, eius dolor neque recusandae animi nostrum, laboriosam at maiores dolores iure. Necessitatibus temporibus praesentium molestias voluptatibus in commodi eaque molestiae natus, obcaecati reiciendis eius amet doloribus voluptates, quam ut placeat possimus voluptatem quae odio vitae pariatur ullam dignissimos. Delectus, beatae? Praesentium recusandae alias repellat dolorem omnis perspiciatis nisi eligendi molestiae quos provident explicabo, quasi dolores tempore harum quam inventore doloribus numquam quis, accusamus libero error? Quis at deserunt nostrum quisquam, ratione aliquid odit iure fugit, sit vitae quod, magnam necessitatibus. Praesentium, et. Quasi nulla ipsum ipsa at consectetur! Consectetur magnam distinctio iusto aliquid corrupti, adipisci consequatur suscipit nesciunt neque accusantium accusamus quia recusandae placeat quis eos debitis nostrum autem numquam odit ullam modi id error, consequuntur qui? Officia dolores, neque eveniet quaerat placeat amet. Vitae placeat ex sit, odit tempore nihil amet velit labore, obcaecati, dolorum iure. Sunt, vitae iure enim neque amet aliquid tempore fuga obcaecati quisquam ut laboriosam quae distinctio asperiores? Soluta illum ratione unde, et cum magnam, sunt iusto ut rem aliquid provident voluptatibus odit illo tenetur? Asperiores facere molestias rerum natus nesciunt tempore eligendi assumenda provident. Quod placeat accusantium doloremque architecto labore omnis ipsa quos, molestiae natus illum nemo maxime suscipit id, dicta, recusandae dignissimos consequuntur quibusdam? Aperiam suscipit alias eius sequi labore quasi nemo aut vel quae sunt! Incidunt impedit ex ad, magni deserunt placeat. Officiis culpa non esse doloribus sit at? Eligendi, quo. Fugiat nobis eaque ipsum quis, praesentium, soluta, deleniti debitis odio officiis enim hic nisi magni distinctio a dolore consectetur sunt nemo harum consequatur quisquam fuga. Molestiae impedit, a placeat illo molestias culpa iste modi officiis sit, nihil error voluptatibus nemo quae incidunt consectetur id minus. Eum est reiciendis harum. Impedit vel sequi doloribus. Non hic reiciendis obcaecati illum itaque dolor, quae earum nulla ullam optio et. Dolor a laborum inventore. Quia et consequatur nulla, architecto illo, quaerat impedit harum, minus iure beatae laboriosam. Libero neque non, soluta deserunt nesciunt fugit sit architecto autem, magni officia iste odit voluptatum! Quisquam ipsum nobis error, tenetur obcaecati dolor, nisi vero unde corporis molestiae distinctio adipisci ullam? Illo quam quibusdam laborum numquam ratione nam, maxime sequi mollitia? Amet expedita enim corporis magni illum deserunt eum officiis. Blanditiis cum esse in optio ipsa quae hic culpa quaerat, eveniet numquam! Praesentium ipsa deleniti explicabo architecto, velit libero cumque commodi tenetur repellendus quaerat omnis esse eaque labore beatae fuga, laborum laboriosam blanditiis! Non eius distinctio dolore sequi blanditiis excepturi mollitia praesentium dignissimos iure maiores, laboriosam aliquam unde consequatur provident ullam animi impedit? Dolore eaque eveniet ea blanditiis cum quis perferendis eos cumque facere quos fugit ullam voluptatibus assumenda, accusamus voluptatem error a esse! Blanditiis obcaecati itaque quibusdam molestiae quisquam! Nemo laudantium asperiores sit commodi. Molestias voluptatibus nulla suscipit, reiciendis autem veritatis voluptatem! Sit, non aliquid. Enim suscipit reprehenderit quos voluptatibus totam optio magni porro perferendis dolores sequi nemo aut vitae repellat provident corporis, laudantium, consequatur facilis, nulla repudiandae itaque? Suscipit repudiandae quos eligendi quam nobis, reprehenderit officia a vitae vel sit, consectetur obcaecati ipsam quas tempore in provident et vero sapiente, ducimus necessitatibus cum amet! Nostrum, beatae quae blanditiis quasi iure qui aspernatur, similique ex ut quas minima odio! Eum obcaecati enim beatae architecto nam qui excepturi sit illum accusantium ex. Dolore ab, eveniet nisi cupiditate mollitia voluptatum accusamus aperiam nostrum natus illo ad qui esse suscipit ducimus alias? Debitis dicta sapiente laborum vel, mollitia blanditiis? Sequi voluptas excepturi adipisci magni eum laboriosam porro aperiam pariatur inventore consequuntur, beatae vel harum exercitationem esse corrupti, fugiat ipsum explicabo ut sit eveniet sunt ad quisquam officia ab! Tenetur ducimus, pariatur doloremque tempore illum expedita ex id nisi impedit minus ab adipisci quos nostrum? Quia itaque sequi, nemo eligendi nesciunt quas placeat architecto dolorem ex enim eius minima quae rerum qui natus voluptates. Ab obcaecati maiores deserunt? Animi veritatis corporis delectus sint ratione rem magnam. Recusandae nisi culpa asperiores similique sit in. Voluptatem non aliquid cupiditate atque iste in ullam pariatur numquam consectetur, repellat beatae blanditiis, saepe dolorem accusamus suscipit enim quisquam ut ipsam voluptate architecto a nihil esse ducimus. Vero ex deserunt doloremque laborum facilis, nam illum, a quis placeat tempore velit quidem fuga facere sequi ut exercitationem eveniet veniam accusamus similique unde nihil optio. Debitis repellat sequi omnis neque asperiores, labore adipisci error voluptatem pariatur libero id et nihil! Fuga est sint sunt consectetur quas iste quasi rerum quidem possimus, voluptas molestias dignissimos ea eum cupiditate provident quaerat minima quae itaque iure laudantium fugit blanditiis ipsum perspiciatis hic! Qui mollitia nam vel, iure, unde rerum neque facilis fugiat veniam, omnis laudantium voluptates tempore! Inventore nisi blanditiis soluta corrupti aliquid quod similique, commodi voluptates. Optio qui ut deserunt ex laborum recusandae impedit magni blanditiis, voluptas facere corporis provident pariatur beatae similique saepe distinctio unde consequatur dolor sequi sed possimus voluptates repudiandae quo excepturi? Iusto assumenda nostrum ipsa sed, voluptatem molestiae voluptatum provident praesentium reprehenderit tempora neque nobis quod sapiente, eveniet laudantium modi sint repellat? Deserunt consequuntur ratione porro explicabo officiis alias vel provident optio, voluptatum debitis quaerat tenetur iure dolore vitae omnis odit, ullam assumenda illum nam accusamus hic? Dolore voluptatibus a libero voluptates beatae perspiciatis explicabo error, placeat saepe officia consequatur. Voluptate eligendi aut, voluptatibus illum molestias fuga vel quasi ipsa voluptatum magni saepe dicta magnam voluptatem. Error, non cum? Aliquid dolor tenetur odit amet qui quibusdam dignissimos. Numquam ratione perspiciatis quod quaerat eveniet quisquam, nesciunt obcaecati. Facere, debitis laborum error ipsam maxime quam exercitationem nulla magni saepe ipsum commodi, natus aspernatur? Error, fuga ullam? Libero, eius, earum suscipit ab assumenda voluptate voluptatem odit sunt at ullam illo ea neque quam nobis eveniet odio autem, tenetur velit iure veritatis nostrum perspiciatis ad perferendis officiis? Porro reprehenderit beatae, repellendus dignissimos impedit asperiores voluptatibus nesciunt ducimus cum vero, est recusandae tenetur quae illo culpa animi, neque temporibus quod aliquid error quas iste nostrum natus a! Alias error id necessitatibus. Quidem vel repudiandae, aspernatur placeat non voluptate ex odio ratione at voluptatibus exercitationem aut voluptas maxime dicta quisquam sequi quo corrupti praesentium. Nostrum dignissimos enim est a? Mollitia molestias minus culpa fuga eveniet maxime a voluptatem, commodi expedita nemo quaerat dolor dignissimos assumenda blanditiis magni reprehenderit dolores quibusdam numquam praesentium aliquid. Dolorum sapiente dolores voluptatibus aliquid, doloremque dignissimos sit obcaecati delectus ut, nobis quibusdam officia, cupiditate quasi inventore! Labore minima quas quasi id aperiam velit eum, nemo suscipit excepturi provident recusandae mollitia, inventore amet nulla molestias qui voluptate, asperiores maxime itaque ex cupiditate laudantium totam quaerat? Repudiandae laborum aliquid aspernatur praesentium, in voluptate obcaecati expedita impedit. Sequi officiis veniam culpa at est, officia voluptatum natus earum nulla labore, porro illo quibusdam. Id dignissimos eaque, eveniet delectus veritatis, ipsam deleniti minima eos ab fugit mollitia modi quibusdam similique quis consequuntur iure rem magnam porro. Cupiditate laborum vel dicta omnis reiciendis, deserunt eius aliquid, eum molestiae ipsa dignissimos odit voluptate molestias in assumenda similique? Harum, inventore excepturi? Dignissimos exercitationem aspernatur doloribus error explicabo incidunt, blanditiis saepe iusto assumenda natus aperiam eaque, at voluptatem. Explicabo nemo vitae, provident eligendi porro amet fugit, perferendis libero, repudiandae dignissimos alias unde animi. Iusto fuga inventore, sequi quam cumque totam tempora suscipit quia perferendis fugiat ipsa obcaecati nihil deleniti voluptatum quo error. Error eveniet eaque quisquam, rerum quis labore facere? Quod excepturi veniam numquam officia sequi alias eveniet eius magnam asperiores accusantium, odit fugit itaque beatae adipisci possimus temporibus error nostrum quaerat quo? Alias necessitatibus maxime repellendus doloribus!
        </div>
      </div>
    </HomeWrap>
  );
};

export default Dashboard;