import React from 'react';
import './styles.css'

import { Link, useMatch, useResolvedPath } from "react-router-dom"

const Navbar = () => {
    return <nav className='nav'>
        <Link to='/' className='site-title'>CPU Simulator</Link>
        <ul>
            <CustomLink to="/cpu-process">Process Management</CustomLink>
        </ul>
    </nav>
}

function CustomLink({ to, children, ...props}) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
    <li className={isActive === to ? "active" : ""}>
        <Link to={to} {...props}>
            {children}
        </Link>
    </li>
    )
}

export default Navbar;