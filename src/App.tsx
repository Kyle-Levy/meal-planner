import { DndProvider } from 'react-dnd'

import { HTML5Backend } from 'react-dnd-html5-backend'
import { MealScheduleProvider } from './context/MealSchedule'
import MealSchedule from './meal-schedule'

function App() {
    return (
        <div className="App">
            <header>
                <DndProvider backend={HTML5Backend}>
                    <MealScheduleProvider>
                        <MealSchedule />
                    </MealScheduleProvider>
                </DndProvider>
            </header>
        </div>
    )
}

export default App
