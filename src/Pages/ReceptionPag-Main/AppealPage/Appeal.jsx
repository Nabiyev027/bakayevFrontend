import "./appeal.scss"
import {useEffect, useState} from "react";
import ApiCall from "../../../Utils/ApiCall";
import {FaTelegramPlane} from "react-icons/fa";
import {jwtDecode} from "jwt-decode";

function Appeal() {
    const [called, setCalled] = useState([]);
    const [unCalled, setUnCalled] = useState([]);
    const userToken = localStorage.getItem("token");
    const userId = jwtDecode(userToken).userId;

    useEffect(() => {
        getAppeals()
    }, [])

    function getAppeals() {
        ApiCall("/reference/getAll", {method: "GET"}).then((res) => {
            if (Array.isArray(res.data)) {
                const calledList = res.data.filter(item => item.status === true);
                const unCalledList = res.data.filter(item => item.status === false);

                setCalled(calledList);
                setUnCalled(unCalledList);
            }
            console.log(res.data);
        }).catch((err) => {
            console.log(err.message);
        });
    }


    function acceptRef(id) {
        ApiCall(`/reference/accept/${userId}?referenceId=${id}`, {method: "PUT"}).then((res) => {
            getAppeals()
            console.log(res.data)
        })
    }

    function deleteRef(id) {
        ApiCall(`/reference/delete/${id}`, {method: "DELETE"}).then((res) => {
            console.log(res.data)
            getAppeals()
        })
    }

    return (
        <div className={"appeal-page"}>
            <h1>Appeal confirmation</h1>

            <div className={"wrap-appeals"}>
                <div className={"box"}>
                    <h2 className={"header"}>Uncalled</h2>
                    <div className="cards-wrap">
                        {
                            unCalled&&unCalled.map((item, index) => <div className={"refer-card"} key={item.id}>
                            <div className={"ref-box-1"}>
                                <h3>{index+1}</h3>
                                <h2>{item.name}</h2>
                                <div className={"phone"}>{item.phone}</div>
                            </div>
                            <div className={"ref-box-2"}>
                                {
                                    item.telegramUserName&&<a href={`https://t.me/`+item.telegramUserName} target="_blank"
                                                              rel="noopener noreferrer"
                                                              className={"telegram-btn"}>
                                        <FaTelegramPlane className={"ico"} />
                                        <span>Telegram</span>
                                    </a>
                                }

                                <div className={"wrap-btn"}>
                                    <button onClick={()=>acceptRef(item.id)} className={"btn btn-a"}>Accept</button>
                                    <button onClick={()=>deleteRef(item.id)} className={"btn btn-d"}>Delete</button>
                                </div>
                            </div>

                            </div>)
                        }
                    </div>
                </div>
                <div className={"box"}>
                    <h2 className={"header"}>Called</h2>
                    <div className="cards-wrap">
                        {
                            called?.map((item, index) => (
                                <div className={"ref-card-2"} key={item.id}>
                                    <div className={"ref-box-1"}>
                                        <h3>{index + 1}</h3>
                                        <h2>{item.name}</h2>
                                        <div className={"phone"}>{item.phone}</div>

                                        <span className={"rec"}>recipient: <i>{item.receptionName}</i></span>

                                        {/* Sana va vaqtni ajratish */}
                                        <span className={"time"}>
          Date: <i>
  {
      item.calledDateTime ?
          (() => {
              const d = new Date(item.calledDateTime);
              const pad = num => num.toString().padStart(2, '0');
              const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
              const time = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
              return `${date} ${time}`;
          })()
          : 'No date available'
  }
</i>
        </span>
                                    </div>
                                    <div className={"ref-box-2"}>
                                        {item.telegramUserName && (
                                            <a href={`https://t.me/` + item.telegramUserName} target="_blank" rel="noopener noreferrer" className={"telegram-btn"}>
                                                <FaTelegramPlane className={"ico"} />
                                                <span>Telegram</span>
                                            </a>
                                        )}

                                        <div className={"wrap-btn"}>
                                            <button onClick={() => deleteRef(item.id)} className={"btn btn-d"}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                    </div>
                </div>


            </div>
        </div>);
}

export default Appeal;