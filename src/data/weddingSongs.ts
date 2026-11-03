// Song finder data for /wedding-entrance-songs and /last-dance-songs-wedding.
//
// RULES
// - Real songs only, with the credited artist and the original release year.
// - `edit: true` means the original has explicit lyrics; DJ DX plays the clean
//   (radio) edit at weddings. Do not list songs with no usable clean edit.
// - Ids are permanent: shared list links (?list=id,id) depend on them.

export type Genre = 'R&B & Soul' | 'Hip-Hop' | 'Pop' | 'Rock' | 'Latin' | 'Afrobeats' | 'House & Dance' | 'Classics';
export interface WSong { id: string; title: string; artist: string; year: number; genre: Genre; vibe: string; edit?: boolean }

export const ENTRANCE_VIBES = ['Hype', 'Feel-good', 'Classy', 'Romantic'] as const;
export const LAST_VIBES = ['Sing-along', 'Slow dance', 'Upbeat send-off'] as const;

export const ENTRANCE: WSong[] = [
  { id: 'e01', title: 'Crazy in Love', artist: 'Beyoncé feat. Jay-Z', year: 2003, genre: 'R&B & Soul', vibe: 'Hype' },
  { id: 'e02', title: 'Love on Top', artist: 'Beyoncé', year: 2011, genre: 'R&B & Soul', vibe: 'Feel-good' },
  { id: 'e03', title: "Signed, Sealed, Delivered I'm Yours", artist: 'Stevie Wonder', year: 1970, genre: 'R&B & Soul', vibe: 'Feel-good' },
  { id: 'e04', title: "Ain't No Mountain High Enough", artist: 'Marvin Gaye & Tammi Terrell', year: 1967, genre: 'R&B & Soul', vibe: 'Feel-good' },
  { id: 'e05', title: 'Happy', artist: 'Pharrell Williams', year: 2013, genre: 'Pop', vibe: 'Feel-good' },
  { id: 'e06', title: 'Uptown Funk', artist: 'Mark Ronson feat. Bruno Mars', year: 2014, genre: 'Pop', vibe: 'Hype' },
  { id: 'e07', title: '24K Magic', artist: 'Bruno Mars', year: 2016, genre: 'Pop', vibe: 'Hype' },
  { id: 'e08', title: "Can't Stop the Feeling!", artist: 'Justin Timberlake', year: 2016, genre: 'Pop', vibe: 'Feel-good' },
  { id: 'e09', title: 'All I Do Is Win', artist: 'DJ Khaled feat. T-Pain, Ludacris, Snoop Dogg & Rick Ross', year: 2010, genre: 'Hip-Hop', vibe: 'Hype', edit: true },
  { id: 'e10', title: 'Jump Around', artist: 'House of Pain', year: 1992, genre: 'Hip-Hop', vibe: 'Hype', edit: true },
  { id: 'e11', title: 'Party Up (Up in Here)', artist: 'DMX', year: 1999, genre: 'Hip-Hop', vibe: 'Hype', edit: true },
  { id: 'e12', title: 'Turn Down for What', artist: 'DJ Snake & Lil Jon', year: 2013, genre: 'House & Dance', vibe: 'Hype' },
  { id: 'e13', title: 'Shout', artist: 'The Isley Brothers', year: 1959, genre: 'Classics', vibe: 'Hype' },
  { id: 'e14', title: 'September', artist: 'Earth, Wind & Fire', year: 1978, genre: 'R&B & Soul', vibe: 'Feel-good' },
  { id: 'e15', title: 'Marry You', artist: 'Bruno Mars', year: 2010, genre: 'Pop', vibe: 'Feel-good' },
  { id: 'e16', title: 'Best Day of My Life', artist: 'American Authors', year: 2013, genre: 'Pop', vibe: 'Feel-good' },
  { id: 'e17', title: 'Single Ladies (Put a Ring on It)', artist: 'Beyoncé', year: 2008, genre: 'R&B & Soul', vibe: 'Hype' },
  { id: 'e18', title: 'Get Ready for This', artist: '2 Unlimited', year: 1991, genre: 'House & Dance', vibe: 'Hype' },
  { id: 'e19', title: 'Seven Nation Army', artist: 'The White Stripes', year: 2003, genre: 'Rock', vibe: 'Hype' },
  { id: 'e20', title: 'Danza Kuduro', artist: 'Don Omar feat. Lucenzo', year: 2010, genre: 'Latin', vibe: 'Hype' },
  { id: 'e21', title: 'Vivir Mi Vida', artist: 'Marc Anthony', year: 2013, genre: 'Latin', vibe: 'Feel-good' },
  { id: 'e22', title: 'Gasolina', artist: 'Daddy Yankee', year: 2004, genre: 'Latin', vibe: 'Hype' },
  { id: 'e23', title: 'Calm Down', artist: 'Rema & Selena Gomez', year: 2022, genre: 'Afrobeats', vibe: 'Feel-good' },
  { id: 'e24', title: 'Love Nwantiti (Ah Ah Ah)', artist: 'CKay', year: 2019, genre: 'Afrobeats', vibe: 'Romantic' },
  { id: 'e25', title: 'Essence', artist: 'Wizkid feat. Tems', year: 2020, genre: 'Afrobeats', vibe: 'Romantic' },
  { id: 'e26', title: '(Your Love Keeps Lifting Me) Higher and Higher', artist: 'Jackie Wilson', year: 1967, genre: 'R&B & Soul', vibe: 'Feel-good' },
  { id: 'e27', title: 'I Gotta Feeling', artist: 'The Black Eyed Peas', year: 2009, genre: 'Pop', vibe: 'Hype' },
  { id: 'e28', title: 'Lose Control', artist: 'Missy Elliott feat. Ciara & Fatman Scoop', year: 2005, genre: 'Hip-Hop', vibe: 'Hype', edit: true },
  { id: 'e29', title: 'Yeah!', artist: 'Usher feat. Lil Jon & Ludacris', year: 2004, genre: 'R&B & Soul', vibe: 'Hype', edit: true },
  { id: 'e30', title: 'Love Never Felt So Good', artist: 'Michael Jackson & Justin Timberlake', year: 2014, genre: 'Pop', vibe: 'Classy' },
  { id: 'e31', title: 'Fly Me to the Moon', artist: 'Frank Sinatra', year: 1964, genre: 'Classics', vibe: 'Classy' },
  { id: 'e32', title: 'Feeling Good', artist: 'Michael Bublé', year: 2005, genre: 'Classics', vibe: 'Classy' },
  { id: 'e33', title: 'Show Me Love', artist: 'Robin S.', year: 1993, genre: 'House & Dance', vibe: 'Hype' },
  { id: 'e34', title: 'Music Sounds Better with You', artist: 'Stardust', year: 1998, genre: 'House & Dance', vibe: 'Feel-good' },
  { id: 'e35', title: 'One More Time', artist: 'Daft Punk', year: 2000, genre: 'House & Dance', vibe: 'Hype' },
  { id: 'e36', title: "Ain't Nobody", artist: 'Rufus & Chaka Khan', year: 1983, genre: 'R&B & Soul', vibe: 'Feel-good' },
  { id: 'e37', title: 'Levels', artist: 'Avicii', year: 2011, genre: 'House & Dance', vibe: 'Hype' },
  { id: 'e38', title: 'Lovely Day', artist: 'Bill Withers', year: 1977, genre: 'R&B & Soul', vibe: 'Romantic' },
  { id: 'e39', title: 'I Wanna Dance with Somebody (Who Loves Me)', artist: 'Whitney Houston', year: 1987, genre: 'Pop', vibe: 'Feel-good' },
  { id: 'e40', title: 'Golden', artist: 'Harry Styles', year: 2019, genre: 'Pop', vibe: 'Feel-good' },
  { id: 'e41', title: 'Run the World (Girls)', artist: 'Beyoncé', year: 2011, genre: 'R&B & Soul', vibe: 'Hype' },
  { id: 'e42', title: "Let's Stay Together", artist: 'Al Green', year: 1971, genre: 'R&B & Soul', vibe: 'Romantic' },
];

export const LAST_DANCE: WSong[] = [
  { id: 'l01', title: "Don't Stop Believin'", artist: 'Journey', year: 1981, genre: 'Rock', vibe: 'Sing-along' },
  { id: 'l02', title: 'Sweet Caroline', artist: 'Neil Diamond', year: 1969, genre: 'Classics', vibe: 'Sing-along' },
  { id: 'l03', title: "Livin' on a Prayer", artist: 'Bon Jovi', year: 1986, genre: 'Rock', vibe: 'Sing-along' },
  { id: 'l04', title: 'Closing Time', artist: 'Semisonic', year: 1998, genre: 'Rock', vibe: 'Sing-along' },
  { id: 'l05', title: 'Last Dance', artist: 'Donna Summer', year: 1978, genre: 'House & Dance', vibe: 'Upbeat send-off' },
  { id: 'l06', title: "(I've Had) The Time of My Life", artist: 'Bill Medley & Jennifer Warnes', year: 1987, genre: 'Pop', vibe: 'Upbeat send-off' },
  { id: 'l07', title: 'Shut Up and Dance', artist: 'Walk the Moon', year: 2014, genre: 'Pop', vibe: 'Upbeat send-off' },
  { id: 'l08', title: 'Wonderful Tonight', artist: 'Eric Clapton', year: 1977, genre: 'Rock', vibe: 'Slow dance' },
  { id: 'l09', title: 'At Last', artist: 'Etta James', year: 1960, genre: 'Classics', vibe: 'Slow dance' },
  { id: 'l10', title: 'Thinking Out Loud', artist: 'Ed Sheeran', year: 2014, genre: 'Pop', vibe: 'Slow dance' },
  { id: 'l11', title: 'Perfect', artist: 'Ed Sheeran', year: 2017, genre: 'Pop', vibe: 'Slow dance' },
  { id: 'l12', title: "Can't Help Falling in Love", artist: 'Elvis Presley', year: 1961, genre: 'Classics', vibe: 'Slow dance' },
  { id: 'l13', title: 'Save the Last Dance for Me', artist: 'The Drifters', year: 1960, genre: 'Classics', vibe: 'Slow dance' },
  { id: 'l14', title: 'Empire State of Mind', artist: 'Jay-Z feat. Alicia Keys', year: 2009, genre: 'Hip-Hop', vibe: 'Sing-along', edit: true },
  { id: 'l15', title: 'Theme from New York, New York', artist: 'Frank Sinatra', year: 1980, genre: 'Classics', vibe: 'Sing-along' },
  { id: 'l16', title: 'Before I Let Go', artist: 'Frankie Beverly & Maze', year: 1981, genre: 'R&B & Soul', vibe: 'Upbeat send-off' },
  { id: 'l17', title: 'Mr. Brightside', artist: 'The Killers', year: 2004, genre: 'Rock', vibe: 'Sing-along' },
  { id: 'l18', title: 'Dancing Queen', artist: 'ABBA', year: 1976, genre: 'Pop', vibe: 'Sing-along' },
  { id: 'l19', title: 'You Are the Best Thing', artist: 'Ray LaMontagne', year: 2008, genre: 'R&B & Soul', vibe: 'Upbeat send-off' },
  { id: 'l20', title: 'Ribbon in the Sky', artist: 'Stevie Wonder', year: 1982, genre: 'R&B & Soul', vibe: 'Slow dance' },
  { id: 'l21', title: 'Adorn', artist: 'Miguel', year: 2012, genre: 'R&B & Soul', vibe: 'Slow dance' },
  { id: 'l22', title: 'Spend My Life with You', artist: 'Eric Benét feat. Tamia', year: 1999, genre: 'R&B & Soul', vibe: 'Slow dance' },
  { id: 'l23', title: 'La Vida Es un Carnaval', artist: 'Celia Cruz', year: 1998, genre: 'Latin', vibe: 'Upbeat send-off' },
  { id: 'l24', title: 'Hey Jude', artist: 'The Beatles', year: 1968, genre: 'Rock', vibe: 'Sing-along' },
  { id: 'l25', title: 'Piano Man', artist: 'Billy Joel', year: 1973, genre: 'Rock', vibe: 'Sing-along' },
  { id: 'l26', title: 'Unforgettable', artist: 'Natalie Cole & Nat King Cole', year: 1991, genre: 'Classics', vibe: 'Slow dance' },
  { id: 'l27', title: 'Stand by Me', artist: 'Ben E. King', year: 1961, genre: 'Classics', vibe: 'Slow dance' },
  { id: 'l28', title: 'Purple Rain', artist: 'Prince', year: 1984, genre: 'Rock', vibe: 'Sing-along' },
  { id: 'l29', title: 'I Wanna Dance with Somebody (Who Loves Me)', artist: 'Whitney Houston', year: 1987, genre: 'Pop', vibe: 'Upbeat send-off' },
  { id: 'l30', title: 'Vivir Mi Vida', artist: 'Marc Anthony', year: 2013, genre: 'Latin', vibe: 'Upbeat send-off' },
  { id: 'l31', title: 'Calm Down', artist: 'Rema & Selena Gomez', year: 2022, genre: 'Afrobeats', vibe: 'Upbeat send-off' },
  { id: 'l32', title: 'Lovely Day', artist: 'Bill Withers', year: 1977, genre: 'R&B & Soul', vibe: 'Upbeat send-off' },
];
