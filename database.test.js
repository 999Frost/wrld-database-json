import fs from "fs";
import Database from "./index.js";

const testPath = "./test-data.json";

// Supprimer le fichier de test avant et après les tests
beforeEach(() => {
  if (fs.existsSync(testPath)) {
    fs.unlinkSync(testPath);
  }
});

afterEach(() => {
  if (fs.existsSync(testPath)) {
    fs.unlinkSync(testPath);
  }
});

test("Create Database instance", () => {
  const db = new Database(testPath);
  expect(db.path).toEqual(testPath);
});

test("Test getAll, set and get", () => {
  const db = new Database(testPath);
  const id = "testId";
  const dataToSet = "testData";

  // Vérifie que la base de données est initialement vide
  expect(db.getAll()).toEqual([]);

  // Ajoute des données à la base de données et vérifie si elles sont correctement stockées
  db.set(id, dataToSet);
  expect(db.get(id)).toEqual(dataToSet);
});

test("Test delete et deleteAll", () => {
  const db = new Database(testPath);
  const id = "testId";
  const dataToSet = "testData";

  // Ajoute des données à la base de données
  db.set(id, dataToSet);

  // Vérifie si les données ont été correctement supprimées
  db.delete(id);
  expect(db.get(id)).toBeUndefined();

  // Ajoute des données à la base de données à nouveau
  db.set(id, dataToSet);

  // Vérifie si toutes les données ont été correctement supprimées
  db.deleteAll();
  expect(db.getAll()).toEqual([]);
});

test("Test push, pull, pullDelete, add et subtract", () => {
  const db = new Database(testPath);
  const id = "testId";

  // Test push
  const dataToPush = "testData";
  db.push(id, dataToPush);
  expect(db.get(id)).toEqual([dataToPush]);

  // Test pull
  const pulledData = db.pull(id, (data) => data === dataToPush);
  expect(pulledData).toEqual([dataToPush]);

  // Test pullDelete
  db.push(id, dataToPush);
  db.pullDelete(id, (data) => data === dataToPush);
  expect(db.get(id)).toEqual([]);

  // Test add
  const numberToAdd = 5;
  db.add(id, numberToAdd);
  expect(db.get(id)).toEqual(numberToAdd);

  // Test subtract
  const numberToSubtract = 3;
  db.subtract(id, numberToSubtract);
  expect(db.get(id)).toEqual(numberToAdd - numberToSubtract);
});
