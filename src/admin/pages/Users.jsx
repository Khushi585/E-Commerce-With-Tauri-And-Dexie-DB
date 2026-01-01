import { useEffect, useState } from "react";
import { db } from "@/db/db";
import { Button } from "@/components/ui/button";

export default function AdminUsers() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadUsers();
	}, []);

	async function loadUsers() {
		setLoading(true);
		const data = await db.users.toArray();
		setUsers(data);
		setLoading(false);
	}

	async function handleDelete(id) {
		await db.users.delete(id);
		loadUsers();
	}

	return (
		<div>
			<h1 className="text-2xl font-bold mb-6">Users</h1>

			{loading ? (
				<p>Loading users...</p>
			) : users.length === 0 ? (
				<p>No users found</p>
			) : (
				<table className="w-full bg-white shadow rounded">
					<thead>
						<tr className="text-left border-b">
							<th className="p-3">ID</th>
							<th>Name</th>
							<th>Email</th>
							<th>Role</th>
							<th>Action</th>
						</tr>
					</thead>
					<tbody>
						{users.map((u) => (
							<tr key={u.id} className="border-b">
								<td className="p-3">{u.id}</td>
								<td>{u.name}</td>
								<td>{u.email}</td>
								<td>{u.role}</td>
								<td>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDelete(u.id)}
									>
										Delete
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
