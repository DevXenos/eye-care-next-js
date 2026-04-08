"use client"

import { Grid as __Grid, GridProps as __GridProps } from "@mui/material";
import { ElementType, ComponentPropsWithoutRef } from "react";

export type GridProps<C extends ElementType = 'div'> = {
	xs?: number;
	sm?: number;
	md?: number;
	lg?: number;
	xl?: number;
	component?: C;
	item?: boolean;
} & Omit<__GridProps, "xs" | "sm" | "md" | "lg" | "xl" | "component">
	& ComponentPropsWithoutRef<C>; // <-- include the props of the component

export default function Grid<C extends ElementType = 'div'>({
	xs, sm, md, lg, xl, component, children, ...props
}: GridProps<C>) {
	const finalBreakpoints = {
		xl,
		lg: lg ?? xl,
		md: md ?? lg ?? xl,
		sm: sm ?? md ?? lg ?? xl,
		xs: xs ?? sm ?? md ?? lg ?? xl,
	};

	return (
		<__Grid
			component={component}
			size={finalBreakpoints}
			{...props}
			className={(props as any).className} // ensure styles are applied
		>
			{children}
		</__Grid>
	);
}