/**
 * একটি অবজেক্ট থেকে শুধুমাত্র নির্দিষ্ট কী (keys) গুলো নিয়ে নতুন একটি অবজেক্ট তৈরি করবে।
 * @param obj - যে অবজেক্ট থেকে ডাটা নিতে হবে (যেমন: req.query)
 * @param keys - যে যে ফিল্ডগুলো আমরা নিতে চাই তার অ্যারে (যেমন: ['limit', 'page'])
 * @returns নতুন একটি অবজেক্ট যেখানে শুধু চাওয়া ডাটাগুলো থাকবে
 */

const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const finalObj: Partial<T> = {};

  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }

  return finalObj;
};

export default pick;