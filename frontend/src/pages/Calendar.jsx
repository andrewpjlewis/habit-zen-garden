import Header from '../components/Header';
import Footer from '../components/Footer';

function Calendar() {
  // Example product list - you can replace with real data later
  const events = [
    { id: 1, name: 'Journal', streak: '4', motivationalMessage: 'Keep it up!' },
    { id: 2, name: 'Meal prep', streak: '2', motivationalMessage: 'Two Days in a row!' },
    { id: 3, name: 'Meditate', streak: '1', motivationalMessage: 'Congratulations on your first step!' },
  ];

  const streakNumber = 3;
  const streakLength = 'day'
  const streakMessage = `${streakNumber} ${streakLength}`

  return (
    <>
        <Header />
        <main>
            <div class="calendarMenu">
              <h1>Calendar</h1>
              <p>You have a {streakMessage} streak! Keep it up!</p>
                <div class="calendarGrid">
                    <table>
                        <tr>
                            <th class="upcoming">29</th>
                            <th class="upcoming">30</th>
                            <th class="streakKept">1</th>
                            <th class="streakLost">2</th>
                            <th class="streakKept">3</th>
                            <th class="streakKept">4</th>
                            <th class="streakLost">5</th>
                        </tr>
                        <tr>
                            <th class="streakKept">6</th>
                            <th class="streakKept">7</th>
                            <th class="streakKept">8</th>
                            <th class="today">9</th>
                            <th class="current">10</th>
                            <th class="current">11</th>
                            <th class="current">12</th>
                        </tr>
                        <tr>
                            <th class="current">13</th>
                            <th class="current">14</th>
                            <th class="current">15</th>
                            <th class="current">16</th>
                            <th class="current">17</th>
                            <th class="current">18</th>
                            <th class="current">19</th>
                        </tr>
                        <tr>
                            <th class="current">20</th>
                            <th class="current">21</th>
                            <th class="current">22</th>
                            <th class="current">23</th>
                            <th class="current">24</th>
                            <th class="current">25</th>
                            <th class="current">26</th>
                        </tr>
                        <tr>
                            <th class="current">27</th>
                            <th class="current">28</th>
                            <th class="current">29</th>
                            <th class="current">30</th>
                            <th class="current">31</th>
                            <th class="upcoming">1</th>
                            <th class="upcoming">2</th>
                        </tr>
                    </table>
                </div>
                <div class="calendarEvents">
                    <ul>
                        {events.map(event => (
                            <li key={event.id}>
                                <h3><strong>{event.name}</strong></h3>
                                <h4>{event.streak} day streak! {event.motivationalMessage}</h4>
                                {/* You can add buttons, images, descriptions here */}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
        <Footer />
    </>
  );
}

export default Calendar;