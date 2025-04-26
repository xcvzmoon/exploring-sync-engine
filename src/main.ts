import { InMemoryDatabase } from './classes/InMemoryDatabase';
import { SyncEngine } from './classes/SyncEngine';
import { wait } from './utils/wait';

const bini = [
  'Jhoanna Christine Robles',
  'Maraiah Queen Arceta',
  'Nicolette Vergara',
  'Mary Loi Yves Ricalde',
  'Gweneth Llaguno Apuli',
  'Stacey Aubrey Sevilleja',
  'Mikhaela Janna Lim',
  'Sheena Mae Catacutan',
];

console.log('\n------------------------------------------------');
console.log('\nLast Write Wins (LWW) Sync Engine Demonstration');
console.log('\n------------------------------------------------');

const clientDB = new InMemoryDatabase();
const serverDB = new InMemoryDatabase();
const lwwEngine = new SyncEngine(clientDB, serverDB);

for (const member of bini) {
  await wait(bini.length);
  serverDB.insert(member);
}

console.log('\n------------------------------------------------');
console.log('\nDatabase Items (initial)');
console.log('Client:', clientDB.selectAll());
console.log('Server:', serverDB.selectAll());
console.log('\n------------------------------------------------');

await lwwEngine.sync();

console.log('\n------------------------------------------------');
console.log('\nDatabase Items (synced)');
console.log('Client:', clientDB.selectAll());
console.log('Server:', serverDB.selectAll());
console.log('\n------------------------------------------------');

await wait(100);

const clientItems = clientDB.selectAll();
const fourthClientItem = clientItems.find((clientItem) => {
  return clientItem.content === bini[4];
});

if (fourthClientItem) {
  clientDB.update(fourthClientItem.uuid, 'Gweneth L. Apuli');
  await wait(100);
}

clientDB.insert('Mon Albert Loayon Gamil');

if (fourthClientItem) {
  await wait(100);
  serverDB.update(fourthClientItem.uuid, 'Gweneth Llaguno Apuli');
}

console.log('\n------------------------------------------------');
console.log('\nDatabase Items (before syncing again)');
console.log('Client:', clientDB.selectAll());
console.log('Server:', serverDB.selectAll());
console.log('\n------------------------------------------------');

await lwwEngine.sync();

console.log('\n------------------------------------------------');
console.log('\nDatabase Items (synced again)');
console.log('Client:', clientDB.selectAll());
console.log('Server:', serverDB.selectAll());
console.log('\n------------------------------------------------');
