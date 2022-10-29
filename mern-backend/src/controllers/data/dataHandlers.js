const tracksHandler = async (req, res) => {
  try {
    const data = [
      { 'id': '1', 'title': 'All About That Bass', 'artist': 'Meghan Trainor', 'album': 'Title - EP', 'genre': 'Pop' },
      { 'id': '2', 'title': 'Baby Come Back', 'artist': 'Magic Juan', 'album': 'Baby Come Back - Single', 'genre': 'Reggaeton & Hip-Hop' },
      { 'id': '3', 'title': 'Blurred Lines (feat. T.I. & Pharrell)', 'artist': 'Robin Thicke', 'album': 'Blurred Lines (feat. T.I. & Pharrell) - Single', 'genre': 'R&B/Soul' },
      { 'id': '4', 'title': 'Call On Me', 'artist': 'Power Music', 'album': 'My Clickmix 10-02-2017 B', 'genre': 'Workout & Fitness' },
      { 'id': '5', 'title': 'Cruel (Rap Version)', 'artist': 'Dane Rumble', 'album': 'Cruel (Rap Version) - Single', 'genre': 'Pop' },
      { 'id': '6', 'title': 'Feliz Navidad', 'artist': 'Tito El Bambino', 'album': '', 'genre': '' },
      { 'id': '7', 'title': 'Freaks (Radio Edit)', 'artist': 'Timmy Trumpet & Savage', 'album': 'Freaks (Radio Edit) - Single', 'genre': 'Dance' },
      { 'id': '8', 'title': 'Happy (from "Despicable Me 2")', 'artist': 'Pharrell Williams', 'album': 'Happy (from "Despicable Me 2") - Single', 'genre': 'Pop' },
      { 'id': '9', 'title': 'Marvin Gaye (feat. Meghan Trainor)', 'artist': 'Charlie Puth', 'album': 'Marvin Gaye (feat. Meghan Trainor) - Single', 'genre': 'Pop' },
      { 'id': '10', 'title': 'Parachute', 'artist': 'Timomatic', 'album': 'Parachute - Single', 'genre': 'Pop' },
      // { 'id': '11', 'title': 'Scream', 'artist': 'DJ Shocker feat. G.G.', 'album': 'My Clickmix 10-27-2012 A', 'genre': 'Workout & Fitness' },
      // { 'id': '12', 'title': 'Sugar', 'artist': 'Power Music', 'album': 'My Clickmix 04-13-2015 A', 'genre': 'Workout & Fitness' },
      // { 'id': '13', 'title': 'Want to Want Me', 'artist': 'Jason Derulo', 'album': 'Everything Is 4', 'genre': 'Pop' },
      // { 'id': '14', 'title': 'Caramelo (Reggaeton) By Periko', 'artist': 'Zumba Fitness', 'album': 'Mega Mix 46', 'genre': 'Spoken & Audio' },
      // { 'id': '15', 'title': 'Gata Brasileira - Axe', 'artist': 'Zumba Fitness', 'album': 'ZIN Volume 26', 'genre': 'Zumba' },
      // { 'id': '16', 'title': 'Prende el Party - Salsa Choke', 'artist': 'Jeison (El Brother)', 'album': 'Mega Mix 49', 'genre': 'Salsa Choke' },
      // { 'id': '17', 'title': 'La Cumbia Del Cucu - Cumbia', 'artist': 'Papayo ft. Victoria "La Mala"', 'album': 'Mega Mix 53', 'genre': 'Cumbia' },
      // { 'id': '18', 'title': 'La Danza del Vaquero - Country', 'artist': 'BIP', 'album': 'Mega Mix 54', 'genre': 'Country' },
      // { 'id': '19', 'title': 'Bailando (feat. Descemer Bueno & Gente de Zona) [Spanish Version]', 'artist': 'Enrique Iglesias', 'album': 'SEX AND LOVE', 'genre': 'Latino' },
      // { 'id': '20', 'title': 'Boogie Boogie - Cha-cha-cha', 'artist': 'BIP', 'album': 'ZIN™ Volume 60', 'genre': 'Cha-cha-chá' },
      // { 'id': '21', 'title': 'Tarzan Boy - Salsa', 'artist': 'Zumba (Cover)', 'album': 'ZIN™ Volume 62', 'genre': 'Salsa' },
      // { 'id': '22', 'title': 'Guaya Guaya - Reggaeton', 'artist': 'Zumba (Cover)', 'album': 'ZIN™ Volume 60', 'genre': 'Reggaeton' },
      // { 'id': '23', 'title': 'Take U There - EDM', 'artist': 'Zumba (Cover)', 'album': 'ZIN™ Volume 59', 'genre': 'EDM' },
      // { 'id': '24', 'title': 'Lamento Boliviano - Bachata', 'artist': 'Zumba (Cover)', 'album': 'ZIN™ Volume 60', 'genre': 'Bachata' },
      // { 'id': '25', 'title': 'Really New Wild Wild West', 'artist': 'Will Smith Feat Dru Hill And Kool Moe', 'album': '1999', 'genre': 'Humour' },
      // { 'id': '26', 'title': 'Call Me Maybe 130BPM', 'artist': 'DJ BE', 'album': '', 'genre': '' },
      // { 'id': '27', 'title': 'Dilema - (BE Remix)', 'artist': 'DJ BE', 'album': 'DJ BE', 'genre': 'Zumba' },
      // { 'id': '28', 'title': 'Forget You 134BPM', 'artist': 'DJ BE', 'album': '', 'genre': '' },
      // { 'id': '29', 'title': 'How Low Can You Go 150bpm', 'artist': '', 'album': '', 'genre': 'TKO' },
      // { 'id': '30', 'title': 'I Believe Zumba - DJ BE - DJ BE', 'artist': '', 'album': '', 'genre': '' },
      // { 'id': '31', 'title': 'I Cry - Step 132BPM', 'artist': 'DJ BE', 'album': 'Step Finale', 'genre': '' },
      // { 'id': '32', 'title': 'Kung Fu Fighting Zumba', 'artist': 'DJ BE', 'album': '', 'genre': '' },
      // { 'id': '33', 'title': 'Last Night - Pump', 'artist': 'DJ BE', 'album': 'DJ BE', 'genre': '' },
      // { 'id': '34', 'title': 'Moves Like Jaggar - TKO 150bpm - DJ BE', 'artist': '', 'album': '', 'genre': '' },
      // { 'id': '35', 'title': '01 8-Move Like Jagger (Saco Box)', 'artist': 'CKB', 'album': 'CKB', 'genre': 'Other' },
      // { 'id': '36', 'title': 'Say You Will - SPIN Hill', 'artist': 'DJ BE', 'album': 'DJ BE', 'genre': '' },
      // { 'id': '37', 'title': 'Tiny Dancer 110BPM', 'artist': 'DJ BE', 'album': '', 'genre': '' },
      // { 'id': '38', 'title': 'Uptown Funk 120bpm', 'artist': 'DJ BE', 'album': '', 'genre': '' },
      // { 'id': '39', 'title': 'Wild Wild Love Zumba TKO - DJ BE - DJ BE', 'artist': '', 'album': '', 'genre': '' },
      // { 'id': '40', 'title': 'Yeah! ( Batuke Mix )', 'artist': 'Dj Joao', 'album': '', 'genre': '' },
      // { 'id': '41', 'title': 'All About That Bass', 'artist': 'Meghan Trainor', 'album': 'Title - EP', 'genre': 'Pop' },
      // { 'id': '42', 'title': 'Baby Come Back', 'artist': 'Magic Juan', 'album': 'Baby Come Back - Single', 'genre': 'Reggaeton & Hip-Hop' },
      // { 'id': '43', 'title': 'Blurred Lines (feat. T.I. & Pharrell)', 'artist': 'Robin Thicke', 'album': 'Blurred Lines (feat. T.I. & Pharrell) - Single', 'genre': 'R&B/Soul' },
      // { 'id': '44', 'title': 'Cruel (Rap Version)', 'artist': 'Dane Rumble', 'album': 'Cruel (Rap Version) - Single', 'genre': 'Pop' },
      // { 'id': '45', 'title': 'Freaks (Radio Edit)', 'artist': 'Timmy Trumpet & Savage', 'album': 'Freaks (Radio Edit) - Single', 'genre': 'Dance' },
      // { 'id': '46', 'title': 'Right Now (Na Na Na)', 'artist': 'Akon', 'album': 'Right Now (Na Na Na) - Single', 'genre': 'Zumba' },
      // { 'id': '47', 'title': 'Follow The Leader - Soca', 'artist': 'DJ BE', 'album': 'DJ BE', 'genre': 'Zumba' },
      // { 'id': '48', 'title': 'Automatic 132 BPM', 'artist': 'DJ BE', 'album': 'DJ BE', 'genre': 'Zumba' },
      // { 'id': '49', 'title': 'Bailar Merengue Zumba - (BE Remix)', 'artist': 'DJ BE', 'album': 'DJ BE', 'genre': 'Zumba' },
      // { 'id': '50', 'title': 'Bananza For Zumba', 'artist': 'DJ BE', 'album': 'DJ BE', 'genre': 'Zumba' },
    ]

    return res.status(200).json({
      data
    });

  } catch (err) {
    console.log(`Error occured. Please try again: ${err}`)
    return res.status(500).send("Error occured. Please try again");
  }
};

module.exports = {
  tracksHandler,
};