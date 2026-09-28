'use client'
import {CirclePlus} from '@gravity-ui/icons';
import { Button } from '@heroui/react';
import Link from 'next/link';

export default function Options() {
    return (
        <section>
            <Button 
            isIconOnly 
            aria-label='Create new layout' 
            size='lg'>
                <Link href="/new/layout">
                    <CirclePlus />
                </Link>
            </Button>
        </section>
    )
}