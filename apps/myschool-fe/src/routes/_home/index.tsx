import { createFileRoute } from '@tanstack/react-router';


export const Route = createFileRoute('/_home/')({
    component : Index,
})

function Index(){
    return (
        <div className='m-5'>
            <h3 className='font-extrabold'>Welcome home</h3>
        </div>
    )
}




