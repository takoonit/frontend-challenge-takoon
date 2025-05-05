import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import CloudSharpIcon from '@mui/icons-material/CloudSharp';

const Header = () => (
    <AppBar position="sticky" className="bg-green-700">
        <Toolbar>
            <Typography variant="h6">
                <Link href="/" passHref>
                    <IconButton>
                        <CloudSharpIcon fontSize="large" color="secondary" />
                    </IconButton>
                </Link>
            </Typography>
        </Toolbar>
    </AppBar>
);

export default Header; 