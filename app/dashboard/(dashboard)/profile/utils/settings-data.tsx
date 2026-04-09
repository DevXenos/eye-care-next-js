import "client-only"

import ChangePassword from "../components/ChangePassword";
import { ProfileType } from "@/types/ProfileType";
import React from "react";
import { User } from "firebase/auth";

export const TABS = [
	// "Profile",
	"Account",
	// "Business",
	// "Inventory",
	// "Hardware"
] as const;
type TabName = typeof TABS[number];


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type RenderInputParam<K extends keyof ProfileType = keyof ProfileType> = {
	uid: User['uid'];
} & ProfileType;

export type RenderInputOnChange<K extends keyof ProfileType = keyof ProfileType> = (name: K, value: ProfileType[K]) => void;

export type RenderInputFunction<K extends keyof ProfileType = keyof ProfileType> = (param: RenderInputParam<K>) => React.ReactNode;


export type SettingsItem<K extends keyof ProfileType = keyof ProfileType> = {
	id: number;
	key?: K;
	title: string;
	desc: string;
	tab: number;
	fullWidth?: boolean;
	renderInput: RenderInputFunction<K>;
};

export const SettingsRegistry: SettingsItem[] = [];

export const addSetting = <K extends keyof ProfileType>(
	item: Omit<SettingsItem<K>, "id" | "tab"> & { tab: TabName }
) => {
	const tabIndex = TABS.indexOf(item.tab);
	if (tabIndex === -1) return;

	SettingsRegistry.push({
		...item,
		id: SettingsRegistry.length + 1,
		tab: tabIndex,
	});
};

// // --- PROFILE SETTINGS ---
// addSetting({
// 	title: "Profile Name",
// 	desc: "Your display name across the dashboard",
// 	tab: "Profile",
// 	fullWidth: true,
// 	renderInput: () => <TextField fullWidth size="small" placeholder="John Doe" />
// });

// addSetting({
// 	title: "Dark Mode",
// 	desc: "Toggle system-wide visual theme",
// 	tab: "Profile",
// 	renderInput: () => <Switch />
// });

// --- ACCOUNT & SECURITY ---
// addSetting({
// 	title: "Email Address",
// 	desc: "Primary email for login and recovery",
// 	tab: "Account",
// 	renderInput: () => <TextField fullWidth size="small" disabled value="user@example.com" />
// });

addSetting({
	title: "Change Password",
	desc: "Update your password regularly to keep your account secure.",
	tab: "Account",
	renderInput: ChangePassword
});

// addSetting({
// 	title: "Two-Factor Authentication",
// 	desc: "Add an extra layer of security to your account using TOTP apps.",
// 	tab: "Account",
// 	fullWidth: true,
// 	renderInput: () => <Button variant="outlined" startIcon={<SecurityIcon />}>Enable 2FA</Button>
// });

// addSetting({
// 	title: "Active Sessions",
// 	desc: "Manage devices currently logged into your account.",
// 	tab: "Account",
// 	fullWidth: true,
// 	renderInput: () => (
// 		<List sx={{ width: "100%", bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #ddd', overflow: 'hidden', p: 0 }}>
// 			{/* 1. WRAP with ListItem to use secondaryAction */}
// 			<ListItem
// 				disablePadding
// 				secondaryAction={
// 					<Button color="error" size="small" variant="outlined">Logout</Button>
// 				}
// 			>
// 				{/* 2. INSERT ListItemButton inside for the ripple/hover */}
// 				<ListItemButton sx={{ py: 1.5, pr: 12 }} onClick={() => { }}>
// 					<DevicesIcon sx={{ mr: 2, color: 'primary.main' }} />
// 					<ListItemText
// 						primary="Chrome on MacOS"
// 						secondary="Active Now • Manila, PH"
// 						primaryTypographyProps={{ fontWeight: 600 }}
// 					/>
// 				</ListItemButton>
// 			</ListItem>

// 			<Divider />

// 			<ListItem
// 				disablePadding
// 				secondaryAction={
// 					<Button color="error" size="small" variant="outlined">Logout</Button>
// 				}
// 			>
// 				<ListItemButton sx={{ py: 1.5, pr: 12 }} onClick={() => { }}>
// 					<DevicesIcon sx={{ mr: 2, color: 'text.secondary' }} />
// 					<ListItemText
// 						primary="iPhone 15 Pro"
// 						secondary="Last active: 2 hours ago"
// 					/>
// 				</ListItemButton>
// 			</ListItem>

// 			<Divider />

// 			<ListItem sx={{ p: 0 }}>
// 				<Button
// 					color="error"
// 					variant="contained"
// 					fullWidth
// 					sx={{ borderRadius: 0, py: 1.5 }}
// 				>
// 					Revoke All Other Sessions
// 				</Button>
// 			</ListItem>
// 		</List>
// 	)
// });

// --- BUSINESS & TAX ---
// addSetting({
// 	title: "Business Address",
// 	desc: "The physical address printed on customer receipts",
// 	tab: "Business",
// 	fullWidth: true,
// 	renderInput: () => <TextField fullWidth multiline rows={2} size="small" />
// });

// addSetting({
// 	title: "Currency",
// 	desc: "Local currency for POS transactions",
// 	tab: "Business",
// 	renderInput: () => (
// 		<Select size="small" defaultValue="PHP" sx={{ minWidth: 120 }}>
// 			<MenuItem value="PHP">PHP (₱)</MenuItem>
// 			<MenuItem value="USD">USD ($)</MenuItem>
// 		</Select>
// 	)
// });

// --- INVENTORY LOGIC ---
// addSetting({
// 	title: "Auto-Deduct Stock",
// 	desc: "Automatically decrease inventory counts upon completed POS sale",
// 	tab: "Inventory",
// 	renderInput: () => <Switch defaultChecked />
// });

// addSetting({
// 	title: "Low Stock Threshold",
// 	desc: "Items will be flagged when stock falls below this number",
// 	tab: "Inventory",
// 	renderInput: () => <TextField type="number" size="small" sx={{ width: 100 }} />
// });

// addSetting({
// 	title: "Negative Stock",
// 	desc: "Allow sales even if stock count is zero or below",
// 	tab: "Inventory",
// 	renderInput: () => <Switch />
// });

// --- HARDWARE & PERIPHERALS ---
// addSetting({
// 	title: "Barcode Scanner Suffix",
// 	desc: "What the scanner sends after a successful read",
// 	tab: "Hardware",
// 	renderInput: () => (
// 		<Select size="small" defaultValue="Enter" sx={{ minWidth: 120 }}>
// 			<MenuItem value="Enter">Enter (CR)</MenuItem>
// 			<MenuItem value="Tab">Tab</MenuItem>
// 			<MenuItem value="None">None</MenuItem>
// 		</Select>
// 	)
// });

// addSetting({
// 	title: "Receipt Printer",
// 	desc: "Direct print to connected thermal printers",
// 	tab: "Hardware",
// 	renderInput: () => <Switch />
// });