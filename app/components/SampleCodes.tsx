"use client"

import { useState } from "react"
import IndexCode from "./codes/IndexCode"
import LayoutCode from "./codes/LayoutCode"
import ApiCode from "./codes/ApiCode"

export default function SampleCodes() {

    const TABS = [
        { id: 'index', label: 'app/pages/index.tsx', Component: IndexCode },
        { id: 'layout', label: 'app/pages/layout.tsx', Component: LayoutCode },
        { id: 'api', label: 'server/api/time.ts', Component: ApiCode }
    ] as const;

    type TabId = typeof TABS[number]['id'];

    const [activeTab, setActiveTab] = useState<TabId>('index');
    const ActiveComponent = TABS.find(t => t.id === activeTab)!.Component;

    return <div className="code-window">
        <div className="win-bar">
            <div className="d" /><div className="d" /><div className="d" />
        </div>

        <div className="win-tabs">
            {TABS.map(({ id, label }) => (
                <div
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`win-tab ${activeTab === id ? 'active' : ''}`}
                >
                    {label}
                </div>
            ))}
        </div>

        <div className="win-body">
            <pre>
                <ActiveComponent />
            </pre>
        </div>
    </div>

}