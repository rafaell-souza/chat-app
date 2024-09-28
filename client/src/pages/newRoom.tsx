import Toolbar from "../components/toolbar";
import { io } from "socket.io-client"
import { useForm } from "react-hook-form"
import chatSchema from "../schemas/chat";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const NewRoom = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(chatSchema)
    });
    const navigate = useNavigate()
    const [error, setError] = useState(false)

    const socket = io("http://localhost:9000", {
        auth: {
            token: localStorage.getItem("token")
        }
    })

    socket.on("connect_error", (error) => {
        setError(true)
        console.log(error)
    });

    socket.on("create-room-error", (error) => {
        console.log(error)
    })

    const handleSubmitForm = handleSubmit((data) => {
        data.token = localStorage.getItem("token")
        socket.emit("create-room", data)
        navigate("/chat")
    })

    return (
        <>
            <section className="flex h-screen w-full">
                <Toolbar isSelected={1} />

                <section className="w-full text-gray-300 flex flex-col relative justify-start">

                    {
                        error && <div className="absolute backdrop-blur-lg w-full h-full flex justify-center items-center">
                            <div className="bg-gray-800 px-4 py-2 rounded flex flex-col items-center">
                                <p>You need to be logged in to create a chat room.</p>
                                <Link to="/login" className="text-blue-400 w-full text-center h-7 rounded px-4 bg-gray-700 hover:bg-gray-800 hover:border hover:border-gray-700 mt-1">login</Link>
                            </div>
                        </div>
                    }

                    <form
                        onSubmit={handleSubmitForm}
                        className="flex mt-8 flex-col px-8 py-4">
                        <h1 className="text-2xl mb-5">Create chat room.</h1>


                        <div className="flex gap-x-8">

                            <div className="flex flex-col w-80">
                                <label>Room name</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900 px-1 h-7 rounded outline-none"
                                    {...register("name")}
                                />

                                <label className="mt-4">Room description</label>
                                <textarea
                                    className="w-full bg-gray-900 p-1 h-20 rounded outline-none"
                                    {...register("description")}
                                ></textarea>

                                <div className="flex gap-x-1 items-center mt-4">
                                    <label htmlFor="Participants">Participants</label>
                                    <input
                                        type="number" min="1" max="50" defaultValue="1"
                                        className="w-11 bg-gray-900 px-1 h-7 rounded outline-none"
                                        {...register("capacity")}
                                    />
                                </div>
                            </div>

                            <div className="gap-x-2 flex">
                                <label htmlFor="language">Chat language:</label>
                                <select
                                    className="bg-gray-900 px-1 h-8 rounded outline-none"
                                    {...register("language")}
                                >
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="German">German</option>
                                    <option value="Portuguese">Portuguese</option>
                                    <option value="Russian">Russian</option>
                                    <option value="Chinese">Chinese</option>
                                    <option value="Japanese">Japanese</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="bg-gray-900 hover:bg-gray-700 h-8 rounded w-40  mt-8"
                        >
                            Create room
                        </button>

                    </form>

                </section>

            </section>
        </>
    )
}

export default NewRoom;