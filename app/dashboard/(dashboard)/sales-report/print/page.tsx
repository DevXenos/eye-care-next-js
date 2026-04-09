"use client"

import SalesPrintView, { SalesPrintPage } from '../__components/SalesPrintView';
import { useEffect, useMemo, useState } from 'react';

import { SalesType } from '@/types/SalesType';
import { useAdmin } from '../../AdminWrapper';
import { useProfile } from '@/stores/profileStore';

export default function PrintPage() {
	const currentAdmin = useAdmin();
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