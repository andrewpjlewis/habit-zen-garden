import Header from '../components/Header';
import Footer from '../components/Footer';

function Social() {
  // Example product list - you can replace with real data later
  const competitors = [
    { id: 1, name: 'Fearsome Rival', points: '3000', indicator: 'rank1' },
    { id: 2, name: 'Habit Keeper (You)', points: '2500', indicator: 'rankYou'},
    { id: 3, name: 'Best Friend', points: '2500', indicator: 'rank3' },
    { id: 4, name: 'Random Person', points: '1000', indicator: 'rank4' },
  ];

  const friends = [
    { id: 1, name: 'Best Friend', activity: '3 minutes'},
    { id: 2, name: 'Crazy Uncle', activity: '6 days'},
    { id: 3, name: 'John Doe', activity: '8 years'},
  ]

  return (
    <>
        <Header />
        <main>
            <div class="socialMenu">
                <h1>Social</h1>
                <p>Connect with friends, compete with enemies</p>
                <div class="rankings">
                    <h2>Rankings</h2>
                    <ul>
                        {competitors.map(competitor => (
                            <li key={competitor.id} class="rankingsItem" id={competitor.indicator}>
                                <h3>#{competitor.id}</h3>
                                <h4><strong>{competitor.name}</strong> — {competitor.points}</h4>
                                {/* You can add buttons, images, descriptions here */}
                            </li>
                        ))}
                    </ul>
                </div>
                <div class="friends">
                    <h2>Friends</h2>
                    <ul>
                        {friends.map(friend => (
                            <li key={friend.id} class="friendsItem">
                                <h3><strong>{friend.name}</strong></h3>
                                <p>Last Active: {friend.activity} ago</p>
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

export default Social;