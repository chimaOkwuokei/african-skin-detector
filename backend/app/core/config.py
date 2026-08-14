from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    medgemma_base_url: str = "https://ecclesia-team--medgemma-serve.modal.run"
    medgemma_user: str = ""
    medgemma_pass: str = ""
    medgemma_model_name: str = "medgemma-1.5-4b"

    database_url: str = "sqlite:///./demo.db"
    db_echo: bool = False
    upload_dir: str = "uploads"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
