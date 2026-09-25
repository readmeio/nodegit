NAN_METHOD(GitRepository::Free) {
  GitRepository *repository = Nan::ObjectWrap::Unwrap<GitRepository>(info.Holder());
  repository->ReleaseValue();

  info.GetReturnValue().Set(Nan::Undefined());
}
