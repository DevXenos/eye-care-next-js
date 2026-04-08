"use client"

import { Divider, Stack } from "@mui/material";
import React from "react"

export type ActionOnTopProps = {
	children?: React.ReactNode;
}

export default function ActionOnTop({children}: ActionOnTopProps) { 
	return (
		<>
			<Stack direction={'row'} gap={2} borderColor={'divider'}>
				{children}
			</Stack>
		</>
	)
}