import React from "react"

type Props = {
    children: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <div className="h-screen overflow-scroll rounded-l-3xl border-l-[1px] border-t-[1px] border-muted-foreground/20 pb-20">
            {children}
        </div>
    )
}

export default Layout
