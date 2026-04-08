import { CircularProgress, Paper, Typography } from "@mui/material";

export default function LoadingComponent() {
	return (
		<Paper sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
			<CircularProgress/>
		</Paper>
	)
}