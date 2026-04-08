"use client"

import { Button, Stack, TextField } from "@mui/material";
import {
	EmailAuthProvider,
	getAuth,
	reauthenticateWithCredential,
	updatePassword
} from "firebase/auth";
import { useCallback, useRef } from "react";

import { RenderInputFunction } from "../utils/settings-data";
import { toast } from "sonner";
import { useDialog } from "@/providers/DialogProvider";

const ChangePassword: RenderInputFunction = () => {

	const { openDialog, removeDialog } = useDialog();
	const oldDialog = useRef<string | null>(null);

	const handle = useCallback(() => {

		if (oldDialog.current) {
			removeDialog(oldDialog.current);
			oldDialog.current = null;
		}

		let currentPassword = "";
		let newPassword = "";
		let confirmPassword = "";

		const auth = getAuth();

		const handleSubmit = async () => {
			try {

				const user = auth.currentUser;

				if (!user || !user.email) {
					toast.error("User not authenticated");
					return;
				}

				if (newPassword.length < 8) {
					toast.error("Password must be at least 8 characters");
					return;
				}

				if (newPassword !== confirmPassword) {
					toast.error("Passwords do not match");
					return;
				}

				const credential = EmailAuthProvider.credential(
					user.email,
					currentPassword
				);

				await reauthenticateWithCredential(user, credential);

				await updatePassword(user, newPassword);

				toast.success("Password changed successfully");

				if (oldDialog.current) {
					removeDialog(oldDialog.current);
					oldDialog.current = null;
				}

			} catch (error: unknown) {
				console.error(error);
				toast.error("Failed to change password");
			}
		};

		const id = openDialog(
			<Stack gap={2}>
				<TextField
					label="Current Password"
					type="password"
					fullWidth
					onChange={(e) => currentPassword = e.target.value}
				/>

				<TextField
					label="New Password"
					type="password"
					fullWidth
					onChange={(e) => newPassword = e.target.value}
				/>

				<TextField
					label="Confirm New Password"
					type="password"
					fullWidth
					onChange={(e) => confirmPassword = e.target.value}
				/>

				<Button
					variant="contained"
					onClick={handleSubmit}
				>
					Update Password
				</Button>
			</Stack>,
			{
				title: "Change Password",
			}
		);

		oldDialog.current = id;

		return () => {
			removeDialog(id);
		};

	}, [openDialog, removeDialog]);

	return (
		<Button onClick={handle}>
			Change Password
		</Button>
	)
}

export default ChangePassword;
