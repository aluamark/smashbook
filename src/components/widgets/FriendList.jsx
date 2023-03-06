import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import { setFriends, setProfileFriends } from "../../state";
import axios from "axios";
import { PropagateLoader } from "react-spinners";

const FriendList = ({ isProfile, id }) => {
	const { userId } = useParams();
	const dispatch = useDispatch();
	const { _id } = useSelector((state) => state.user);
	const userfriends = useSelector((state) => state.user?.friends);
	const profileUserFriends = useSelector((state) => state.profileUser?.friends);
	const token = useSelector((state) => state.token);
	const [loading, setLoading] = useState(false);

	const getFriends = async () => {
		setLoading(true);
		const response = await axios.get(
			`https://smashbook-server.onrender.com/users/${id}/friends`,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);
		const data = response.data;

		if (isProfile) {
			dispatch(setProfileFriends({ friends: data }));
		} else {
			dispatch(setFriends({ friends: data }));
		}
		setLoading(false);
	};

	const handleAddRemoveFriend = async (friendId) => {
		setLoading(true);
		const response = fetch(
			`https://smashbook-server.onrender.com/users/${_id}/${friendId}`,
			{
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		)
			.then((response) => response.json())
			.then((result) => result)
			.catch((error) => {
				throw new Error({ error: error.message });
			});

		const data = await response;

		if (isProfile) {
			dispatch(setProfileFriends({ friends: data }));
		} else {
			dispatch(setFriends({ friends: data }));
		}
		setLoading(false);
	};

	useEffect(() => {
		getFriends();
	}, [userId, id]);

	const renderUserFriends = (friends) => {
		return (
			<div className="flex flex-col gap-3 pt-1">
				{friends?.length !== 0 &&
					friends?.map((friend, index) => {
						return (
							<div
								key={index}
								className="flex items-center text-sm font-semibold"
							>
								<Link
									to={`/profile/${friend._id}`}
									className="hover:brightness-110 rounded-full"
								>
									<img
										src={friend.picturePath}
										alt={friend.picturePath}
										className="w-9 h-9 object-cover rounded-full"
									/>
								</Link>

								<Link to={`/profile/${friend._id}`}>
									<div className="flex flex-col pl-3 justify-center hover:underline">
										<span>{`${
											friend?.firstName?.charAt(0).toUpperCase() +
											friend?.firstName?.slice(1)
										} ${
											friend?.lastName?.charAt(0).toUpperCase() +
											friend?.lastName?.slice(1)
										}`}</span>
									</div>
								</Link>

								<div className="ml-auto">
									<MdPersonRemoveAlt1
										onClick={() => handleAddRemoveFriend(friend._id)}
										className="hover:fill-red-500 fill-red-600 ml-auto w-5 h-5 cursor-pointer"
									/>
								</div>
							</div>
						);
					})}
			</div>
		);
	};

	const renderProfileUserFriends = (friends) => {
		return (
			<div className="flex flex-col gap-3 pt-3">
				{friends?.length !== 0 &&
					friends?.map((friend, index) => {
						return (
							<div
								key={index}
								className="flex items-center text-sm font-semibold"
							>
								<Link
									to={`/profile/${friend._id}`}
									className="hover:brightness-110 rounded-full"
								>
									<img
										src={friend.picturePath}
										alt={friend.picturePath}
										className="w-9 h-9 object-cover rounded-full"
									/>
								</Link>

								<Link to={`/profile/${friend._id}`}>
									<div className="flex flex-col pl-3 justify-center hover:underline">
										<span>{`${
											friend?.firstName?.charAt(0).toUpperCase() +
											friend?.firstName?.slice(1)
										} ${
											friend?.lastName?.charAt(0).toUpperCase() +
											friend?.lastName?.slice(1)
										}`}</span>
									</div>
								</Link>

								<div className="ml-auto">
									{userId === _id ? (
										<MdPersonRemoveAlt1
											onClick={() => handleAddRemoveFriend(friend._id)}
											className="hover:fill-red-500 fill-red-600 w-5 h-5 cursor-pointer"
										/>
									) : null}
								</div>
							</div>
						);
					})}
			</div>
		);
	};

	return (
		<div className="bg-white dark:bg-zinc-800 dark:text-neutral-300 border dark:border-zinc-800 rounded-xl shadow px-4 py-3">
			<div className="font-semibold">Friends</div>
			{loading ? (
				<div className="text-center py-5">
					<PropagateLoader color="#3B82F6" height={10} width={300} />
				</div>
			) : (
				<div className="pt-2">
					{isProfile
						? renderProfileUserFriends(profileUserFriends)
						: renderUserFriends(userfriends)}
				</div>
			)}
		</div>
	);
};

export default FriendList;
