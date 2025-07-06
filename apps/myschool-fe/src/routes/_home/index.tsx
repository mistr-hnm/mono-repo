import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/_home/')({
    component : Index,
})

function Index(){
    return (
        <div>
            <h3>Welcome home</h3>
        </div>
    )
}




