import Home from "./Home";
import Editor from "./Editor";

export const routesConfig = [
    {path: '/', element: <Home />, linkName: 'Home'},
    {path: '/editor', element: <Editor />, linkName: 'Editor'},
]