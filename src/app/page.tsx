"use client";;

import { Box, Button, TextField, Typography } from '@mui/material';
import { useActionState, useEffect } from 'react';

import LoadingScreen from '@/components/loading/LoadingScreen';
import loginUser from '@/services/current-user/login-user';
import { useCurrentUser } from '@/stores/currentUserStore';
import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();
	
	const [formState, formAction, isFormLoading] = useActionState(loginUser, null);

	const [currentUser] = useCurrentUser();

	useEffect(() => {
		if (currentUser) {
			return router.replace('/dashboard');
		}
	}, [currentUser, router]);

	// Check user Auth
	if (currentUser) return <LoadingScreen />;

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
					defaultValue={formState?.email}
				/>

				<TextField
					label="Password"
					placeholder="Enter your Password"
					name="password"
					type="password"
					defaultValue={formState?.password}
				/>

				<Button
					variant="contained"
					type={'submit'}
					loading={isFormLoading}>
					Login
				</Button>
			</Box>
		</Box>
	);
}
