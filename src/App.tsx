import './App.css'

import { MealScheduleProvider } from './context/MealSchedule'
import MealSchedule from './meal-schedule'

function App() {
    return (
        <div className="App">
            <header className="App-header bg-brown-50">
                <MealScheduleProvider>
                    <MealSchedule />
                </MealScheduleProvider>
            </header>
        </div>
    )
}

export default App
