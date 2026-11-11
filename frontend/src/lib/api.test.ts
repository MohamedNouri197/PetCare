import { api } from "./api";

const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  mockFetch.mockReset();
});

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
}

describe("ApiClient", () => {
  describe("login", () => {
    it("calls /api/auth/login with POST and returns token + user", async () => {
      const payload = { token: "tok_123", user: { id: "1", email: "a@b.com" } };
      mockFetch.mockReturnValueOnce(jsonResponse(payload));

      const result = await api.login("a@b.com", "pass123");
      expect(result).toEqual(payload);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, opts] = mockFetch.mock.calls[0];
      expect(url).toBe("/api/auth/login");
      expect(opts.method).toBe("POST");
      expect(JSON.parse(opts.body)).toEqual({ email: "a@b.com", password: "pass123" });
    });

    it("throws on 401", async () => {
      mockFetch.mockReturnValueOnce(
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ message: "Bad credentials" }),
        })
      );
      await expect(api.login("a@b.com", "wrong")).rejects.toEqual(
        expect.objectContaining({ message: "Bad credentials", status: 401 })
      );
    });
  });

  describe("getAnimals", () => {
    it("calls /api/animals with GET", async () => {
      const animals = [{ id: "1", name: "Rex" }];
      mockFetch.mockReturnValueOnce(jsonResponse(animals));

      const result = await api.getAnimals();
      expect(result).toEqual(animals);
      const [url] = mockFetch.mock.calls[0];
      expect(url).toBe("/api/animals");
    });
  });

  describe("createAnimal", () => {
    it("calls /api/animals with POST", async () => {
      const animal = { id: "2", name: "Mimi" };
      mockFetch.mockReturnValueOnce(jsonResponse(animal, 201));

      const result = await api.createAnimal({ name: "Mimi", species: "cat" });
      expect(result).toEqual(animal);
      const [, opts] = mockFetch.mock.calls[0];
      expect(opts.method).toBe("POST");
    });
  });

  describe("getReminders", () => {
    it("calls /api/reminders with GET", async () => {
      const reminders = [{ id: "r1", title: "Vaccin" }];
      mockFetch.mockReturnValueOnce(jsonResponse(reminders));

      const result = await api.getReminders();
      expect(result).toEqual(reminders);
    });
  });

  describe("createReminder", () => {
    it("calls /api/reminders with POST", async () => {
      const reminder = { id: "r2", title: "RDV" };
      mockFetch.mockReturnValueOnce(jsonResponse(reminder, 201));

      const result = await api.createReminder({ title: "RDV", type: "appointment" });
      expect(result).toEqual(reminder);
      const [url, opts] = mockFetch.mock.calls[0];
      expect(url).toBe("/api/reminders");
      expect(opts.method).toBe("POST");
    });
  });

  describe("deleteAppointment", () => {
    it("calls /api/appointments/:id with DELETE", async () => {
      mockFetch.mockReturnValueOnce(
        Promise.resolve({ ok: true, status: 204, json: () => Promise.resolve({}) })
      );

      await api.deleteAppointment("apt1");
      const [url, opts] = mockFetch.mock.calls[0];
      expect(url).toBe("/api/appointments/apt1");
      expect(opts.method).toBe("DELETE");
    });
  });

  describe("getMedicalRecords", () => {
    it("calls /api/animals/:id/medical", async () => {
      mockFetch.mockReturnValueOnce(jsonResponse([]));
      await api.getMedicalRecords("a1");
      expect(mockFetch.mock.calls[0][0]).toBe("/api/animals/a1/medical");
    });
  });

  describe("getVetProfiles", () => {
    it("calls /api/vet/profiles", async () => {
      const profiles = [{ id: "v1", name: "Dr. Test" }];
      mockFetch.mockReturnValueOnce(jsonResponse(profiles));

      const result = await api.getVetProfiles();
      expect(result).toEqual(profiles);
      expect(mockFetch.mock.calls[0][0]).toBe("/api/vet/profiles");
    });
  });
});
