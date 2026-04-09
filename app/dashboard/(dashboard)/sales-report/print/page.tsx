"use client"

import { useEffect, useState } from 'react';

import { SalesPrintPage } from '../__components/SalesPrintView';
import { SalesType } from '@/types/SalesType';
import useAdminAccount from '@/stores/currentUserStore';
import { useProfile } from '@/stores/profileStore';

export default function PrintPage() {
	const {currentAdmin} = useAdminAccount();
	const { profile } = useProfile(currentAdmin.uid);
	const [sales, setSales] = useState<SalesType[]>([]);

	useEffect(() => {
		const session = sessionStorage.getItem('sales');
		if (!session) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setSales([]);
		} else {
			const sales = JSON.parse(session) as SalesType[];
			setSales(sales);
		}
	}, [])

	return <SalesPrintPage
		sales={sales}
		dateFormat={profile.dateFormat} />;

}