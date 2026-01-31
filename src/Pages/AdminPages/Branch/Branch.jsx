import React, {useEffect, useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./branch.scss";
import ApiCall from "../../../Utils/ApiCall";
import {IoLocation} from "react-icons/io5";
import {toast, ToastContainer} from "react-toastify";

function Branch() {
  const BASE_URL = "http://localhost:8080";
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editBranch, setEditBranch] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [expandedBranch, setExpandedBranch] = useState(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [filial, setFilial] = useState({
    name: "",
    location: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [roomData, setRoomData] = useState({name: "", number: "" });

  useEffect(() => {
    getBranches()
  },[])

  async function getBranches() {
    try {
      const res = await ApiCall("/filial/getAll",{method:"GET"})
      setBranches(res.data);

    } catch (err) {
      console.log("Malumotlar yoq");
    }
  }

  const resetForm = () => {
    setFilial({name: "", location: "", description: ""});
    setSelectedImage(null);
    setSelectedBranch(null);
    setImageFile(null);
  }

  const resetRoom = () => {
    setSelectedRoom(null);
    setSelectedBranch(null);
    setRoomData({name: "", number: "" });
  }

  const openBranchModal = () => {
    setShowBranchModal(true);
  };

  const saveBranch = async () => {
    // ⚠️ Muhim! Foydalanuvchi interfeysini to'sib qo'ymaslik uchun keyingi bosqichda buni o'zgartirish kerak.
    if (!filial.name || !filial.location || !filial.description) {
      alert("Please enter all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", filial.name);
    formData.append("location", filial.location);
    formData.append("description", filial.description);

    // 💡 imageFile mavjud bo'lsa, qo'shamiz
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // Tahrirlash/Qo'shish logikasi
    try {
      const method = editBranch ? "PUT" : "POST";
      const url = editBranch ? `/filial/update/${selectedBranch.id}` : "/filial";

      await ApiCall(url, { method: method }, formData);

      // Muvaffaqiyatli xabar ko'rsatish
      toast.success(`Branch ${editBranch ? 'updated' : 'added'} successfully!`);

    } catch (err) {
      // ❌ Eng muhim qismi: Server xatolarini foydalanuvchiga ko'rsatish
      console.error("Filial saqlanmadi (API xatosi):", err);
      // Serverdan kelgan xato xabarini ko'rsatishga harakat qiling
      const errorMessage = err.response?.data?.message || "An error occurred while saving the branch.";
      toast.error(errorMessage);
      return; // Muvaffaqiyatsiz bo'lsa, formani yopmaslik kerak
    }

    // Muvaffaqiyatli yakunlanganda
    resetForm();
    await getBranches();
    setShowBranchModal(false);
  };


  const deleteBranch = async (id) => {
    try {
      const res = await ApiCall(`/filial/delete/${id}`, {method: "DELETE"})
      await getBranches()
      toast.success(res.data)
    } catch (err) {
      toast.error(err.response.data);
    }
  }

  const toggleExpand = (id) =>
    setExpandedBranch(expandedBranch === id ? null : id);

  const openRoomModal = (branch, room = null) => {
    setSelectedBranch(branch);

    if (room) {
      setSelectedRoom(room);
      setRoomData({
        name: room.name || "",
        number: room.number || "",
      });
      setEditRoom(true);
    } else {
      setSelectedRoom(null);
      setRoomData({ name: "", number: "" });
      setEditRoom(false);
    }

    setShowRoomModal(true);
  };

  const saveRoom = async () => {
    if (!roomData.name || !roomData.number) {
      alert("Please enter all required fields");
    }

    if (editRoom) {
      try {
        const res = await ApiCall(`/room/${selectedRoom.id}`,{method:"PUT"}, {
          name: roomData.name,
          number: roomData.number,
        })
        setEditRoom(false);
        resetRoom()
        await getBranches()
      }catch (err) {
        console.log("Room not updated");
      }
    } else {
      try {
        const res = await ApiCall(`/room/${selectedBranch.id}`,{method:"POST"}, {
          name: roomData.name,
          number: roomData.number,
        })
        resetRoom()
        await getBranches()
      } catch (err) {
        console.log("Room not saved")
      }
    }


    setShowRoomModal(false);
  };

  const deleteRoom = async (roomId) => {
    try {
      const res = await ApiCall(`/room/${roomId}`, {method: "DELETE"})
      await getBranches()
    } catch (err) {
      console.log("Room not deleted");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  function updateBranch(branch) {
    setSelectedBranch(branch);

    setFilial({
      name: branch.name,
      location: branch.location,
      description: branch.description
    });

    setImageFile(null); // ✅ Tahrirlash rejimida yangi rasm tanlanmaguncha "imageFile" null bo'ladi
    setSelectedImage(null); // ✅ Rasm previewni tozalash

    setEditBranch(true); // ✅ Tahrirlash rejimini yoqish
    openBranchModal();
  }


  function updateRoom(branch,room) {
    setSelectedRoom(room);
    setRoomData({ name: room.name || "", number: room.number || "" });
    setEditRoom(true);
    openRoomModal(branch,room)
  }

  function cancelSaveBranch() {
    setShowBranchModal(false)
    setEditBranch(false);
    resetForm()
  }

  return (
    <div className="branch-page">

      <ToastContainer />

      <h1>Branches</h1>
      <button className="btn-add" onClick={openBranchModal}>
        + Add Branch
      </button>

      <div className="branch-list">
        {branches.map((branch) => (
          <motion.div
            layout
            key={branch.id}
            className="branch-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {branch.imageUrl && (
              <div className="branch-photo">
                <img src={`${BASE_URL+branch.imageUrl}`} alt={branch.name} />
              </div>
            )}
            <div className="card-header">
              <div>
                <h2>{branch.name}</h2>
                <a className={"location"}
                   onClick={(e) => {
                     e.preventDefault();
                     navigator.clipboard.writeText(branch.location)
                         .then(() => {
                           toast.success("Location copied!");
                         })
                         .catch(err => {
                           console.error("Copy failed:", err);
                         });
                   }}
                >
                  <IoLocation /> Location
                </a>
              </div>
              <div className="actions">
                <button onClick={() => updateBranch(branch)}>Edit</button>
                <button onClick={() => deleteBranch(branch.id)}>Delete</button>
                <button onClick={() => toggleExpand(branch.id)}>
                  {expandedBranch === branch.id ? "Hide Rooms" : "Show Rooms"}
                </button>
                <button
                  className="addRoom"
                  onClick={() => openRoomModal(branch)}
                >
                  + Room
                </button>
              </div>
            </div>
            <p className="description">{branch.description}</p>

            <AnimatePresence>
              {Array.isArray(branch.rooms) && expandedBranch === branch.id && (
                <motion.div
                  className="rooms"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <h3>Rooms:</h3>
                  {branch.rooms.map((room) => (
                    <motion.div
                      key={room.id}
                      className="room-card"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                    >
                      <span>
                        №{room.number} {room.name}
                      </span>
                      <div className="room-actions">
                        <button onClick={()=>updateRoom(branch,room)}>
                          Edit
                        </button>
                        <button onClick={() => deleteRoom(room.id)}>
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Branch Modal */}
      <AnimatePresence>
        {showBranchModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2>{selectedBranch ? "Edit Branch" : "Add Branch"}</h2>
              <input
                placeholder="Name"
                value={filial.name}
                onChange={(e) =>
                  setFilial({ ...filial, name: e.target.value })
                }
                required
              />
              <input
                placeholder="Location"
                value={filial.location}
                onChange={(e) =>
                  setFilial({ ...filial, location: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Description"
                value={filial.description}
                onChange={(e) =>
                  setFilial({ ...filial, description: e.target.value })
                }
                required
              />
              <div className="image-upload">
                <label htmlFor="branchImage">Choose Photo</label>
                <input
                  type="file"
                  id="branchImage"
                  accept=".png,.jpg,.jpeg,.svg,.webp"
                  onChange={handleImageChange}
                />
                {selectedImage ? (
                    <div className="image-preview">
                      <img src={selectedImage} alt="Preview" />
                    </div>
                ) : selectedBranch?.imageUrl ? (
                    <div className="image-preview">
                      <img src={`${BASE_URL}${selectedBranch.imageUrl}`} alt="Preview" />
                    </div>
                ) : null}
              </div>
              <div className="modal-actions">
                <button onClick={cancelSaveBranch}>
                  Cancel
                </button>
                <button onClick={saveBranch}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Room Modal */}
      <AnimatePresence>
        {showRoomModal && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2>
                {roomData.id
                  ? `Edit Room in ${selectedBranch?.name || ""}`
                  : `Add Room to ${selectedBranch?.name || ""}`}
              </h2>
              <input
                placeholder="Room Name"
                value={roomData.name}
                onChange={(e) =>
                  setRoomData({ ...roomData, name: e.target.value })
                }
                required
              />
              <input
                placeholder="Room Number"
                value={roomData.number}
                onChange={(e) =>
                  setRoomData({ ...roomData, number: e.target.value })
                }
                required
              />
              <div className="modal-actions">
                <button onClick={() => setShowRoomModal(false)}>Cancel</button>
                <button onClick={saveRoom}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Branch;
