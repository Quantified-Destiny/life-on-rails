<div class="mx-auto max-w-xl border border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
  <div class="mb-8">
    <h2 class="mb-2 text-2xl font-semibold">Create Subjective</h2>
    <form class="flex flex-col space-y-4">
      <div class="my-3 mx-2">
        <label class="mb-2 block text-sm font-bold text-gray-700" for="title"> Title </label>
        <input class="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none" id="title" type="text" placeholder="Enter subjective title" />
      </div>

      <div class="my-3 mx-2">
        <label class="mb-2 block text-sm font-bold text-gray-700" for="description"> Description </label>
        <textarea name="description" id="description" class="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none" placeholder="Enter subjective description" rows="3" required></textarea>
      </div>

      <div class="my-3 mx-2">
        <label class="mb-2 block text-sm font-bold text-gray-700" for="description"> Link to a Goal (Optional)</label>
        <select
          id="goal"
          name="goal"
          class="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow-sm focus:outline-none"
          value={selectedGoal}
          onChange={(e) => setSelectedGoal(e.target.value)}>
          <option value="" ">Select a goal</option>
            <option key={goal.id} value={goal.id}>
              {goal.name}
            </option>
        </select>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="mr-2 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Cancel</button>
        <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Create Subjective</button>
      </div>
    </form>
  </div>
</div>
