import assert from 'node:assert/strict';
import test from 'node:test';
import { analizarISO } from '../src/utilidades/fechas.ts';

test('analizarISO acepta fechas válidas y años bisiestos', () => {
  assert.deepEqual(analizarISO('2024-02-29'), { anio: 2024, mes: 2, dia: 29 });
  assert.deepEqual(analizarISO('2025-04-30'), { anio: 2025, mes: 4, dia: 30 });
});

test('analizarISO rechaza fechas imposibles o mal formadas', () => {
  assert.equal(analizarISO('2023-02-29'), null);
  assert.equal(analizarISO('2025-04-31'), null);
  assert.equal(analizarISO('2025-13-01'), null);
  assert.equal(analizarISO('2025--01'), null);
});
