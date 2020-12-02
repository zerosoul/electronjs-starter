import { ITodo, IBookmark, IWithId } from './types';
import generateId from 'utils/generateId';

export function createTodo({
  after,
  text = '',
}: { after?: { ident: number }; text?: string } = {}): ITodo {
  return {
    id: generateId('todo'),
    text: text || '',
    isCompleted: false,
    autoCompleted: false,
    ident: after ? after.ident : 0,
  };
}

export function createBookmark({ uri = '' }: { uri?: string } = {}): IBookmark {
  return {
    id: generateId('bookmark'),
    uri,
  };
}

export function findIndex<T extends IWithId>(collection: T[], item: IWithId) {
  return collection.findIndex(({ id }) => id === item.id);
}

export function find<T extends IWithId>(collection: T[], item: IWithId): T {
  // NOTE(rstankov): Searching for item that doesn't exists is a bug
  return collection.find(({ id }) => id === item.id) as T;
}

export function insertAfter<T extends IWithId>(
  collection: T[],
  after: IWithId | undefined,
  item: T,
) {
  const insertAt = after ? findIndex(collection, after) : -1;

  if (insertAt === -1) {
    collection.push(item);
  } else {
    collection.splice(insertAt + 1, 0, item);
  }
}

export function move<T extends IWithId>(collection: T[], item: T, by: number) {
  const index = findIndex(collection, item);
  const newIndex = index + by;

  if (!collection[index] || !collection[newIndex]) {
    return;
  }

  const temp = collection[index];

  collection.splice(index, 1);
  collection.splice(newIndex, 0, temp);
}

export function paste<T extends IWithId>(
  collection: T[],
  payload: { id: string; clipboard: string },
  fnUpdate: (item: T, text: string) => void,
  fnNew: (after: T, text: string) => T,
) {
  const [first, ...rest] = payload.clipboard
    .split('\n')
    .map(s => s.replace(/^[\W]*(-|\*) (\[( |x)\] )?/, ''))
    .map(s => s.trim())
    .filter(s => !!s);

  const item = find(collection, payload);

  fnUpdate(item, first);

  let after = item;
  rest.reverse().forEach(text => {
    insertAfter(collection, after, fnNew(after, text));
  });
}
