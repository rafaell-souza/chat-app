import Toolbar from "../components/toolbar";
import { useForm } from "react-hook-form"
import chatSchema from "../schemas/chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const NewRoom = () => {
    const {
        register,
        handleSubmit,
    } = useForm({
        resolver: zodResolver(chatSchema)
    });
    const navigate = useNavigate()

    const handleSubmitForm = handleSubmit(async (data) => {
        const response = await fetch("http://localhost:9000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(data)
        })

        const newChat = await response.json()
        navigate(`/chat/${newChat.chatId}`)
    })

    return (
        <>
            <section className="flex h-screen w-full">
                <Toolbar isSelected={1} />

                <section className="w-full text-gray-300 flex flex-col relative justify-start">

                    <form
                        onSubmit={handleSubmitForm}
                        className="flex mt-8 flex-col px-4">
                        <h1 className="text-2xl mb-7">Create chat room.</h1>


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