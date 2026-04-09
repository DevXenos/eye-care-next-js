"use client"

import { Box, Button, TextField, Typography } from '@mui/material';

import loginUser from '@/services/current-user/login-user';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { verifySessionToken } from '@/actions/admin';

export default function Home() {
	const [isLoading, startTransition] = useTransition();

	const formAction = (formData: FormData) => {
		startTransition(() => {
			toast.promise(
				loginUser(formData).then(async () => {
					return verifySessionToken();
				}),
				{
					loading: "Authenticating",
					success: (admin) => {
						if (!admin) throw new Error("Failed to login. Please try again");
						return `Login Successfully as ${admin.email}`
					},
					error: (e) => {
						return (e as Error).message
					}
				}
			)
		})
	}

	return (
		<Box
			sx={{
				height: "100svh",
				display: "flex",
				flexDirection: "column",
			}}
		>

			<Box
				component={'form'}
				action={formAction}
				sx={{
					width: "100%",
					maxWidth: "500px",
					gap: 2,
					display: "flex",
					flexDirection: "column",
					boxShadow: {
						md: "0 0 3px",
						xs: "0"
					},
					mx: "auto",
					mt: 2,
					p: 3
				}}
			>
				<Typography
					fontFamily={'system-ui'}
					fontSize={24}
					fontWeight={600}
					textAlign={'center'}
				>
					Admin Login
				</Typography>

				<TextField
					label="Email"
					placeholder="Enter your Email"
					name="email"
					type="email"
				/>

				<TextField
					label="Password"
					placeholder="Enter your Password"
					name="password"
					type="password"
				/>

				<Button
					variant="contained"
					type={'submit'}
					loading={isLoading}>
					Login
				</Button>
			</Box>
		</Box>
	);
}
