'use client'
import { DashboardQueryResponse } from "@/lib/types";
import { Table } from "@heroui/react";
import Link from "next/link";

export default function DashboardTable(payload: DashboardQueryResponse) {
    return (
        <Table>
            <Table.ScrollContainer>
                <Table.Content aria-label="Dashboard table">
                    <Table.Header>
                        <Table.Column>Name</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {payload.map(layout => (
                            <Table.Row key={layout.id}>
                                <Table.Cell>
                                    <Link href={`/layout/${layout.id}`}>
                                        {layout.title ?? "Untitled"}
                                    </Link>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                        {payload.length === 0 && <Table.Row><Table.Cell>No layouts saved yet.</Table.Cell></Table.Row>}
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
    )
}