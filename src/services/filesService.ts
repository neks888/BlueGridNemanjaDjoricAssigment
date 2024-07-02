import axios from "axios";

interface TestData {
  fileUrl: string;
}

interface ApiResponse {
  items: TestData[];
}

const cache: { data: any; timestamp: number } = { data: null, timestamp: 0 };
const CACHE_DURATION = 60 * 1000;

const fetchAndTransformData = async (): Promise<any> => {
  const now = Date.now();

  if (cache.data && now - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }

  try {
    const response = await axios.get<ApiResponse>(
      "https://rest-test-eight.vercel.app/api/test"
    );
    const data: ApiResponse = response.data;

    if (!Array.isArray(data.items)) {
      throw new Error("API response items is not an array");
    }

    const result: any = {};

    data.items.forEach((item: TestData) => {
      const url = new URL(item.fileUrl);
      const [ip, port] = url.host.split(":");
      const paths = url.pathname.split("/").filter((p) => p);

      if (!result[ip]) {
        result[ip] = [];
      }

      let currentLevel = result[ip];

      paths.forEach((path, index) => {
        let found = currentLevel.find(
          (d: any) => typeof d === "object" && d[path]
        );

        if (!found) {
          if (index === paths.length - 1) {
            currentLevel.push(path);
          } else {
            found = { [path]: [] };
            currentLevel.push(found);
            currentLevel = found[path];
          }
        } else {
          currentLevel = found[path];
        }
      });
    });

    cache.data = result;
    cache.timestamp = now;

    return result;
  } catch (error) {
    console.error("Error fetching or transforming data:", error);
    throw error;
  }
};

export { fetchAndTransformData };
