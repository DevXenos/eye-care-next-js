"use client"

import { Box, Button, TextField, Typography } from '@mui/material';
import { FIREBASE_ADMIN_LOADING, FIREBASE_ADMIN_SUCCESS } from '@/constants/firebaseMessages';
import { SubmitEvent, useTransition } from 'react';

import loginUser from '@/services/current-user/login-user';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();
	const [isLoading, startTransition] = useTransition();

	const formAction = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target)

		startTransition(() => {
			toast.promise(
				loginUser(formData).then(() => {
					router.push('/dashboard/overview')
				}),
				{
					loading: FIREBASE_ADMIN_LOADING['authentication'],
					success: FIREBASE_ADMIN_SUCCESS['authentication'],
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
				onSubmit={formAction}
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
					required
					label="Email"
					placeholder="Enter your Email"
					name="email"
					type="email"
				/>

				<TextField
					required
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
