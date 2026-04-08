import React from "react";

export type LayoutProp<T = unknown> = {
	children: React.ReactNode;
} & (unknown extends T ? object : T);