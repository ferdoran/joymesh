import {Button, Stack, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom"

export default function Home() {

    return (
        <Stack sx={{height: '100%'}} direction="column" alignItems="center" spacing={2}>
            <Typography>Welcome to Joymesh, the first publicly available editor for Silkroad Online navigation meshes.</Typography>
            <Button variant="outlined" component={RouterLink} to="/editor">Get started</Button>
        </Stack>
    )
}